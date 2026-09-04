'use client'

import { useId, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/Button'
import { FadeIn } from '@/components/FadeIn'
import { inquiryTypes, type InquiryTypeId } from '@/lib/siteConfig'

function Field({
  label,
  children,
  labelClassName = '',
}: {
  label: string
  children: (props: { id: string }) => React.ReactNode
  labelClassName?: string
}) {
  const id = useId()

  return (
    <div className="group relative z-0 transition-all focus-within:z-10">
      {children({ id })}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-6 top-1/2 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-neutral-950 ${labelClassName}`}
      >
        {label}
      </label>
    </div>
  )
}

const inputClasses =
  'peer block w-full border border-neutral-300 bg-transparent px-6 pb-4 pt-12 text-base/6 text-neutral-950 ring-4 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 group-first:rounded-t-2xl group-last:rounded-b-2xl'

function TextInput({
  label,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & { label: string }) {
  return (
    <Field label={label}>
      {({ id }) => (
        <input type="text" id={id} placeholder=" " {...props} className={inputClasses} />
      )}
    </Field>
  )
}

function TextArea({
  label,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & { label: string }) {
  return (
    <Field label={label} labelClassName="top-12">
      {({ id }) => (
        <textarea
          id={id}
          rows={5}
          placeholder=" "
          {...props}
          className={inputClasses}
        />
      )}
    </Field>
  )
}

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent' }
  | { state: 'error'; message: string }

export default function Form() {
  const searchParams = useSearchParams()
  const preselected = searchParams.get('inquiry') as InquiryTypeId | null
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const selectId = useId()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    setStatus({ state: 'sending' })
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          body.error ?? 'The message didn’t send. Try again in a moment.',
        )
      }
      setStatus({ state: 'sent' })
      form.reset()
    } catch (error) {
      setStatus({
        state: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The message didn’t send. Try again in a moment.',
      })
    }
  }

  if (status.state === 'sent') {
    return (
      <FadeIn>
        <div className="rounded-3xl bg-neutral-50 p-8 ring-1 ring-neutral-950/5">
          <h2 className="font-display text-2xl font-semibold text-neutral-950">
            Message sent
          </h2>
          <p className="mt-4 text-base text-neutral-600">
            It’s with the right people on our team. Expect a reply within two
            business days.
          </p>
          <button
            type="button"
            onClick={() => setStatus({ state: 'idle' })}
            className="mt-6 text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline"
          >
            Send another message
          </button>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn className="lg:order-last">
      <form onSubmit={onSubmit} noValidate>
        <h2 className="font-display text-base font-semibold text-neutral-950">
          Send us a message
        </h2>

        <div className="isolate mt-6 -space-y-px rounded-2xl bg-white/50">
          <TextInput label="Name" name="name" autoComplete="name" required />
          <TextInput
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <TextInput
            label="Organization"
            name="organization"
            autoComplete="organization"
          />

          <div className="group relative z-0 border border-neutral-300 px-6 pb-4 pt-8 transition-all focus-within:z-10">
            <label
              htmlFor={selectId}
              className="block text-sm font-semibold text-neutral-950"
            >
              What’s this about?
            </label>
            <select
              id={selectId}
              name="inquiryType"
              defaultValue={preselected ?? 'general'}
              className="mt-2 block w-full border-0 bg-transparent p-0 text-base/6 text-neutral-950 focus:outline-none focus:ring-0"
            >
              {inquiryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-neutral-500">
              This decides who on the team gets your message first.
            </p>
          </div>

          <TextArea label="Message" name="message" required />
        </div>

        {/* Spam trap. Real people never see or fill this. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website-url">Leave this field empty</label>
          <input
            id="website-url"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          Don’t send export-controlled or classified information through this
          form. For controlled technical discussion, ask us for an NDA first.
        </p>

        {status.state === 'error' ? (
          <p
            role="alert"
            className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {status.message}
          </p>
        ) : null}

        <Button type="submit" className="mt-10" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
      </form>
    </FadeIn>
  )
}