import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { SectionIntro } from '@/components/SectionIntro'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx'
import Quote from '@/components/quote'
import { loadArticles } from '@/lib/mdx'
import { PageLinks } from '@/components/PageLinks'

function CaseStudies({
  caseStudies,
}: {
  caseStudies: Array<MDXEntry<CaseStudy>>
}) {
  return (
    <div>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <FadeIn key={caseStudy.href} className="flex">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href={caseStudy.href}>
                    <span className="absolute inset-0 rounded-3xl" />
                    {/*<Image
                      src={caseStudy.logo}
                      alt={caseStudy.client}
                      className=""
                      unoptimized
                    /> */}
                  </Link>
                </h3>
                {/*<p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time
                    dateTime={caseStudy.date.split('-')[0]}
                    className="font-semibold"
                  >
                    {caseStudy.date.split('-')[0]}
                  </time>
                  <span className="text-neutral-300" aria-hidden="true">
                    /
                  </span>
                  <span>Products</span>
                </p> */}
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  {caseStudy.title}
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  {caseStudy.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </div>
  )
}

export const metadata: Metadata = {
  description:
    'TOWSTER Corporation is specializing in innovative medical technology, specifically in creating automated mission critical solutions for critical care scenarios.',
}

export default async function Home() {
  let caseStudies = (await loadCaseStudies()).slice(0, 3)
  let blogArticles = (await loadArticles()).slice(0, 2)

  return (
    <div>
      <Container className="mt-24 sm:mt-32 md:mt-56">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            Mobile Hyperbaric Solutions
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            TOWSTER Corporation is specializing in innovative medical
            technology, specifically in creating automated mission critical
            solutions for critical care scenarios. Our team is accustomed to
            navigating the complex and dynamic field of medical tech
            development, where the stakes are high and the pressure is always
            on.
          </p>
        </FadeIn>
        {/* <Timeline /> */}
      </Container>

      <SectionIntro
        title="Meet TOWSTER Pod"
        className="p-30 mb-20 mt-16 rounded-2xl bg-zinc-100  pb-20 pt-20 sm:mt-16 lg:mt-40"
      >
        <p>
          The TOWSTER Pod is revolutionizing amphibious MEDEVAC operations
          through fully autonomous transportation in a controlled, submerged
          environment. Vital tracking and hyperbaric oxygen treatment permit
          extension of the medical “golden hour” for injured personnel.
        </p>
      </SectionIntro>
      <Quote />

      {/* <Clients /> */}

      <CaseStudies caseStudies={caseStudies} />

      {/*
      <PageLinks
        className="mt-24 sm:mt-32 lg:mt-40"
        title="From the newsroom"
        intro="Latest news and article from TOWSTER Corporation"
        pages={blogArticles}
      />
      */}

      {/* <Services /> */}

      <ContactSection />
    </div>
  )
}
