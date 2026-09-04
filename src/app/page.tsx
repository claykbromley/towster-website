import { type Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/Button'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { MediaCarousel } from '@/components/Mediacarousel'
import { SectionIntro } from '@/components/SectionIntro'
import { StatList, StatListItem } from '@/components/StatList'
import { featuredMedia, sortedMedia } from '@/lib/media'
import { legalNotices, siteConfig } from '@/lib/siteConfig'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx'

/**
 * Capabilities the pod delivers. Kept to public-releasable framing — no
 * partner names, no controlled detail.
 */
const capabilities = [
  {
    title: 'Thermoregulation',
    body: 'Active warming against cold-water immersion and environmental extremes, the front end of the lethal triad.',
  },
  {
    title: 'En route life support',
    body: 'Device-agnostic integration with fielded ventilation, oxygen, and monitoring hardware rather than a proprietary stack.',
  },
  {
    title: 'Continuous telemetry',
    body: 'Vitals forwarded to the receiving role of care over tactical radio or SATCOM, buffered through link loss.',
  },
  {
    title: 'Platform agnostic',
    body: 'One pod across uncrewed air, ground, surface, and undersea carriers, on standard L-track and seat-rail interfaces.',
  },
  {
    title: 'Protected transit',
    body: 'A sealed, pressure-tight closure rated for seawater immersion that a casualty can secure and open unassisted.',
  },
  {
    title: 'Medical logistics',
    body: 'The same envelope carries blood products and temperature-sensitive supplies forward when it is not carrying a casualty.',
  },
]

function Capabilities() {
  return (
    <Container className="mt-24">
      <FadeIn>
        <h2 className="font-display text-3xl font-medium text-neutral-950 sm:text-4xl">
          Six problems, one system
        </h2>
        <p className="mt-6 max-w-3xl text-xl text-neutral-600">
          Today’s casualty evacuation assumes a medic and a ride. In contested
          maritime and Arctic operations, both can be unavailable for hours or
          days. The pod is built to carry that gap.
        </p>
      </FadeIn>

      <FadeInStagger
        faster
        className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {capabilities.map((capability) => (
          <FadeIn key={capability.title}>
            <div className="h-full rounded-3xl p-8 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50">
              <h3 className="font-display text-lg font-semibold text-neutral-950">
                {capability.title}
              </h3>
              <p className="mt-3 text-base text-neutral-600">
                {capability.body}
              </p>
            </div>
          </FadeIn>
        ))}
      </FadeInStagger>
    </Container>
  )
}

function Products({ caseStudies }: { caseStudies: Array<MDXEntry<CaseStudy>> }) {
  if (caseStudies.length === 0) return null

  return (
    <Container className="mt-24">
      <FadeIn>
        <h2 className="font-display text-3xl font-medium text-neutral-950 sm:text-4xl">
          Configurations
        </h2>
      </FadeIn>
      <FadeInStagger className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {caseStudies.map((caseStudy) => (
          <FadeIn key={caseStudy.href} className="flex">
            <article className="relative flex w-full flex-col rounded-3xl p-8 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50">
              <h3 className="font-display text-2xl font-semibold text-neutral-950">
                <Link href={caseStudy.href}>
                  <span className="absolute inset-0 rounded-3xl" />
                  {caseStudy.title}
                </Link>
              </h3>
              <p className="mt-4 text-base text-neutral-600">
                {caseStudy.description}
              </p>
            </article>
          </FadeIn>
        ))}
      </FadeInStagger>
    </Container>
  )
}

export const metadata: Metadata = {
  description: siteConfig.description,
}

export default async function Home() {
  let caseStudies = (await loadCaseStudies()).slice(0, 3)
  let carouselItems = featuredMedia.length > 0 ? featuredMedia : sortedMedia

  return (
    <div>
      <Container className="mt-24">
        <FadeIn className="max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-widest text-neutral-500">
            Autonomous casualty evacuation
          </p>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            Golden hour, revitalized
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            When evacuation is denied, transit time has to become treatment
            time. The TOWSTER Pod is a thermoregulated casualty evacuation pod
            with closed-loop life support, designed to hold a critical casualty
            across sea, ground, and air on crewed or uncrewed platforms.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4">
            <Button href="/work">See the system</Button>
            <Button href="/media" invert={false}>
              Watch and read the deck
            </Button>
          </div>
        </FadeIn>
      </Container>

      <Container className="mt-16 sm:mt-20">
        <StatList>
          <StatListItem value="20 lb" label="Deflated weight" />
          <StatListItem value="10 m" label="Closure seawater rating" />
          <StatListItem value="24–72 hr" label="Target hold time" />
          <StatListItem value="USA" label="Built, Berry-aligned" />
        </StatList>
      </Container>

      <SectionIntro
        title="Built for the fight it will actually see"
        className="mt-24 rounded-3xl bg-neutral-100 py-20 sm:mt-32 lg:mt-40"
      >
        <p>
          Whitewater-grade urethane-coated fabric, heat-welded seams, and
          RF-welded hardware. It packs to a 20-pound bundle, inflates in the
          field, and mounts to standard L-track and seat-rail systems.
        </p>
      </SectionIntro>

      <Capabilities />

      <Container className="mt-24">
        <FadeIn>
          <h2 className="font-display text-3xl font-medium text-neutral-950 sm:text-4xl">
            See it work
          </h2>
        </FadeIn>
          <MediaCarousel items={carouselItems} showFilters={false} />
        <FadeIn>
          <p className="mt-8">
            <Link
              href="/media"
              className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline"
            >
              All media and the overview deck →
            </Link>
          </p>
        </FadeIn>
      </Container>

      <Products caseStudies={caseStudies} />

      {/* Honest maturity. Defense evaluators reward this and punish its absence. */}
      <Container className="mt-24">
        <FadeIn>
          <div className="rounded-3xl bg-neutral-950 px-8 py-12 sm:px-12">
            <h2 className="font-display text-2xl font-semibold text-white">
              Where the program stands
            </h2>
            <p className="mt-4 max-w-3xl text-base text-neutral-300">
              Prototype V2 is in build, with platform interfaces and medical
              device integration underway. Field testing with ground and air
              platform partners is planned for late 2026. Closed-loop autonomy
              is in development, not demonstrated.
            </p>
            <p className="mt-6">
              <Link
                href="/contact?inquiry=government"
                className="text-sm font-semibold text-white underline-offset-4 hover:underline"
              >
                Talk to us about a program fit →
              </Link>
            </p>
          </div>
        </FadeIn>
      </Container>

      <Container className="mt-16">
        <FadeIn>
          <p className="max-w-3xl border-l-2 border-neutral-200 pl-6 text-sm text-neutral-500">
            {legalNotices.investigational}
          </p>
        </FadeIn>
      </Container>

      <ContactSection />
    </div>
  )
}