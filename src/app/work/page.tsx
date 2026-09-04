import { type Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { Blockquote } from '@/components/Blockquote'
import { Border } from '@/components/Border'
import { Button } from '@/components/Button'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx'
import { legalNotices } from '@/lib/siteConfig'

/**
 * Public-releasable specifications only. Anything that reveals performance
 * margins, materials sourcing, or integration detail belongs in the NDA deck.
 */
const specifications: Array<[string, string]> = [
  ['Inflated envelope', '84 in × 72 in × 24 in'],
  ['Packed weight', '20 lb (current build)'],
  ['Shell', 'Urethane-coated fabric, heat-welded seams, RF-welded hardware'],
  ['Next revision', 'Dyneema and Vectran — lighter, stronger, UV-resistant'],
  ['Closure', 'Dual pressure-tight zipper, rated to 10 m seawater'],
  ['Mounting', 'Standard L-track and AS33601 seat-rail interfaces'],
  ['Carriers', 'Uncrewed air, ground, surface, and undersea platforms'],
  ['Sourcing', 'Made in the USA, Berry Amendment aligned'],
]

function Specifications() {
  return (
    <Container className="mt-24">
      <FadeIn>
        <h2 className="font-display text-3xl font-medium text-neutral-950 sm:text-4xl">
          Specifications
        </h2>
        <dl className="mt-10 grid grid-cols-1 gap-x-8 border-t border-neutral-200 sm:grid-cols-2">
          {specifications.map(([label, value]) => (
            <div
              key={label}
              className="border-b border-neutral-200 py-6 sm:flex sm:justify-between sm:gap-8"
            >
              <dt className="font-mono text-xs uppercase tracking-widest text-neutral-500 sm:pt-1">
                {label}
              </dt>
              <dd className="mt-2 text-base text-neutral-950 sm:mt-0 sm:max-w-sm sm:text-right">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-neutral-500">
          Figures describe the current prototype and will change as the build
          progresses.
        </p>
      </FadeIn>
    </Container>
  )
}

function CaseStudies({
  caseStudies,
}: {
  caseStudies: Array<MDXEntry<CaseStudy>>
}) {
  if (caseStudies.length === 0) return null

  return (
    <Container className="mt-24">
      <FadeIn>
        <h2 className="font-display text-3xl font-medium text-neutral-950 sm:text-4xl">
          Configurations
        </h2>
      </FadeIn>

      <div className="mt-10 space-y-20 sm:space-y-24 lg:space-y-32">
        {caseStudies.map((caseStudy) => (
          <FadeIn key={caseStudy.href}>
            <article>
              <Border className="pt-16">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                  
                  {/* Text */}
                  <div>
                    <p className="font-display text-4xl font-medium text-neutral-950">
                      <Link href={caseStudy.href}>
                        {caseStudy.title}
                      </Link>
                    </p>

                    <div className="mt-6 space-y-6 text-base text-neutral-600">
                      {caseStudy.summary.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-8 flex">
                      <Button
                        href={caseStudy.href}
                        aria-label={`Read more about ${caseStudy.title}`}
                      >
                        Read more
                      </Button>
                    </div>

                    {caseStudy.testimonial && (
                      <Blockquote
                        author={caseStudy.testimonial.author}
                        className="mt-12"
                      >
                        {caseStudy.testimonial.content}
                      </Blockquote>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src={caseStudy.image.src}
                      alt={caseStudy.title}
                      className="h-auto w-full object-cover"
                    />
                  </div>

                </div>
              </Border>
            </article>
          </FadeIn>
        ))}
      </div>
    </Container>
  )
}

export const metadata: Metadata = {
  title: 'The System',
  description:
    'The TOWSTER Pod: a thermoregulated casualty evacuation pod with en route life support, built for crewed and uncrewed carriers across sea, ground, and air.',
}

export default async function Work() {
  let caseStudies = await loadCaseStudies()

  return (
    <>
      <PageIntro eyebrow="The system" title="A sealed pod that treats in transit">
        <p>
          The pod carries a casualty through the part of the mission where care
          usually stops: the move. It regulates temperature, hosts fielded life
          support and monitoring hardware, streams vitals ahead to the receiving
          role of care, and rides on whatever platform is available.
        </p>
        <p>
          Video walkthroughs and the abbreviated overview deck are on the{' '}
          <Link
            href="/media"
            className="font-semibold text-neutral-950 underline-offset-4 hover:underline"
          >
            media page
          </Link>
          .
        </p>
      </PageIntro>

      <Specifications />

      <CaseStudies caseStudies={caseStudies} />

      <Container className="mt-16">
        <FadeIn>
          <p className="max-w-3xl border-l-2 border-neutral-200 pl-6 text-sm text-neutral-500">
            {legalNotices.investigational} {legalNotices.patent}
          </p>
        </FadeIn>
      </Container>

      <ContactSection />
    </>
  )
}