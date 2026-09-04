import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { inquiryTypeIds, type InquiryTypeId } from '@/lib/siteConfig'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Parse a comma-separated env var into a clean address list. */
function list(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
}

/**
 * Recipients by inquiry type. Everyone in CONTACT_TO_DEFAULT is always
 * included, so nothing is ever missed if a category list is empty.
 */
const routing: Record<InquiryTypeId, string[]> = {
  general: list(process.env.CONTACT_TO_GENERAL),
  government: list(process.env.CONTACT_TO_GOVERNMENT),
  partnership: list(process.env.CONTACT_TO_PARTNERSHIP),
  investment: list(process.env.CONTACT_TO_INVESTMENT),
  clinical: list(process.env.CONTACT_TO_CLINICAL),
  press: list(process.env.CONTACT_TO_PRESS),
  careers: list(process.env.CONTACT_TO_CAREERS),
}

/**
 * In-memory throttle. Enough to stop casual form abuse. On serverless each
 * instance keeps its own counter, so swap in Upstash or a KV store if the form
 * starts attracting real traffic.
 */
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

const escape = (value: string) =>
  value.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages from this connection. Try again later.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  // Spam trap: bots fill every field they find.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const organization = String(body.organization ?? '').trim()
  const message = String(body.message ?? '').trim()
  const inquiryType = String(body.inquiryType ?? 'general') as InquiryTypeId

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 },
    )
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'That email address doesn’t look right.' },
      { status: 400 },
    )
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: 'Message is too long. Keep it under 5,000 characters.' },
      { status: 400 },
    )
  }
  const type: InquiryTypeId = inquiryTypeIds.includes(inquiryType)
    ? inquiryType
    : 'general'

  // Fan out: category list plus the always-on list, de-duplicated.
  const recipients = Array.from(
    new Set([...list(process.env.CONTACT_TO_DEFAULT), ...routing[type]]),
  )

  if (recipients.length === 0) {
    console.error('Contact form has no recipients configured.')
    return NextResponse.json(
      { error: 'The form isn’t accepting messages right now.' },
      { status: 500 },
    )
  }

  const from = process.env.CONTACT_FROM ?? 'TOWSTER site <no-reply@towstercorp.com>'

  try {
    const { error } = await resend.emails.send({
      from,
      to: recipients,
      replyTo: email, // replies go to the sender, not the whole list
      subject: `[${type}] ${name}${organization ? ` — ${organization}` : ''}`,
      text: [
        `Type: ${type}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || '—'}`,
        '',
        message,
      ].join('\n'),
      html: `
        <table style="font-family:system-ui,sans-serif;font-size:14px">
          <tr><td><strong>Type</strong></td><td>${escape(type)}</td></tr>
          <tr><td><strong>Name</strong></td><td>${escape(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escape(email)}</td></tr>
          <tr><td><strong>Organization</strong></td><td>${escape(organization) || '—'}</td></tr>
        </table>
        <p style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escape(message)}</p>
      `,
    })

    if (error) throw error

    // Acknowledgement to the sender. Failure here shouldn't fail the request.
    if (process.env.CONTACT_SEND_ACK === 'true') {
      resend.emails
        .send({
          from,
          to: email,
          subject: 'We received your message — TOWSTER Corporation',
          text: `${name},\n\nThanks for reaching out. Your message is with the right people on our team and you can expect a reply within two business days.\n\n— TOWSTER Corporation`,
        })
        .catch((e) => console.error('Acknowledgement failed:', e))
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact send failed:', error)
    return NextResponse.json(
      { error: 'The message didn’t send. Try again, or email us directly.' },
      { status: 502 },
    )
  }
}