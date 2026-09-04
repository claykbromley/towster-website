import { type Metadata } from 'next'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { MediaCarousel } from '@/components/Mediacarousel'
import { PageIntro } from '@/components/PageIntro'
import { SlideDeck } from '@/components/Slidedeck'
import { deckSlides, sortedMedia } from '@/lib/media'
import { legalNotices } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Media & Presentations',
  description:
    'Product footage, conference briefings, and an abbreviated overview of the TOWSTER Pod program.',
}

export default function Media() {
  return (
    <>
      <PageIntro
        eyebrow="Media"
        title="See the system and hear the case for it"
      >
        <p>
          Product footage and recorded briefings, plus a short version of the
          deck we present to program offices and investors. New recordings are
          added here after each conference.
        </p>
      </PageIntro>

      <Container className="mt-16 sm:mt-20">
        <MediaCarousel items={sortedMedia} />
      </Container>

      <Container className="mt-24">
        <FadeIn>
          <h2 className="font-display text-3xl font-medium text-neutral-950 sm:text-4xl">
            Overview deck
          </h2>
          <p className="mt-4 max-w-2xl text-base text-neutral-600">
            Seven slides covering the problem, the system, and where the program
            stands. The full deck — including engineering detail and financials
            — is shared under NDA.
          </p>
        </FadeIn>

        <div className="mt-10">
          <SlideDeck slides={deckSlides} />
        </div>
      </Container>

      <Container className="mt-16">
        <FadeIn>
          <p className="max-w-3xl border-l-2 border-neutral-200 pl-6 text-sm text-neutral-500">
            {legalNotices.exportControl}
          </p>
        </FadeIn>
      </Container>

      <ContactSection />
    </>
  )
}