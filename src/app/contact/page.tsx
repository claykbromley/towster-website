import { type Metadata } from 'next'
import { Suspense } from 'react'

import { Border } from '@/components/Border'
import { Container } from '@/components/Container'
import Form from '@/components/Form'
import { PageIntro } from '@/components/PageIntro'
import { legalNotices } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach the TOWSTER Corporation team about program opportunities, platform integration, investment, or press.',
}

export default function Contact() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Tell us what you need">
        <p>
          Program offices, platform integrators, clinicians, and investors all
          reach us here. Say which you are and the message goes straight to the
          right people.
        </p>
      </PageIntro>

      <Container className="mt-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24">
          {/* Suspense boundary: Form reads ?inquiry= via useSearchParams. */}
          <Suspense fallback={null}>
            <Form />
          </Suspense>
        </div>

        <Border className="mt-16 pt-16">
          <p className="mt-4 text-sm text-neutral-600">
            {legalNotices.exportControl}
          </p>
        </Border>
      </Container>
    </>
  )
}