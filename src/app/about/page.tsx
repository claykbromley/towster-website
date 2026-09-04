import { type Metadata } from 'next'
import Image, { type StaticImageData } from 'next/image'

import { Border } from '@/components/Border'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { StatList, StatListItem } from '@/components/StatList'
import { siteConfig } from '@/lib/siteConfig'

interface Person {
  name: string
  role: string
  image: string
}

const people: Person[] = [
  { 
    name: 'Yousef Ahmed, M.D.',
    role: 'Co-founder & CEO', 
    image: '/team/Yousef_Ahmed.jpg'
  },
  {
    name: 'Andre Savadjian, M.D.',
    role: 'Co-founder & COO',
    image: '/team/Andre_Savadjian.jpg',
  },
  { 
    name: 'Matt Brendel', 
    role: 'Chief Financial Officer', 
    image: '/team/Matt_Brendel.jpg' 
  },
  {
    name: 'Rodney Brenneman',
    role: 'Business Manager',
    image: '/team/Rodney_Brenneman.jpg',
  },
  {
    name: 'Clayton Bromley',
    role: 'Co-founder & Technical Advisor',
    image: '/team/Clayton_Bromley.jpg',
  },
  {
    name: 'Jacob Becker',
    role: 'Co-founder & Technical Advisor',
    image: '/team/Jacob_Becker.jpg',
  },
]

function Team() {
  return (
    <Container className="mt-24">
      <FadeInStagger>
        <Border as={FadeIn} />
        <div className="grid grid-cols-1 gap-6 pt-12 sm:pt-16 lg:grid-cols-4 xl:gap-8">
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold text-neutral-950">
              Team
            </h2>
          </FadeIn>
          <div className="lg:col-span-3">
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
            >
              {people.map((person) => (
                <li key={person.name}>
                  <FadeIn>
                    <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
                      <Image
                        height={1000}
                        width={1000}
                        src={person.image}
                        alt={`${person.name}, ${person.role}`}
                        className="h-96 w-full object-cover grayscale transition duration-500 motion-safe:group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-black/0 to-40% p-6 text-center">
                        <p className="font-display text-base/6 font-semibold tracking-wide text-white">
                          {person.name}
                        </p>
                        <p className="mt-2 text-sm text-white/80">
                          {person.role}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeInStagger>
    </Container>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'TOWSTER Corporation is a physician-founded team building autonomous casualty evacuation and en route life support.',
}

export default function About() {
  const yearsActive = new Date().getFullYear() - siteConfig.founded

  return (
    <>
      <PageIntro eyebrow="About us" title="Physician-founded, physician-led">
        <p>
          TOWSTER Corporation formed in {siteConfig.founded} around the design
          of the TOWSTER Pod. Dr. Yousef Ahmed, a critical care
          anesthesiologist, started with a modified ventilation concept and
          moved to a transportable pod once it was clear the harder problem was
          keeping a casualty alive during transit, not at the bedside.
        </p>
        <p>
          The people who will use this system are the reason it is designed the
          way it is: clinicians defining the care, engineers defining the
          envelope, and defense operators defining the constraints.
        </p>
      </PageIntro>

      <Container className="mt-16">
        {/* Derived from the array so the number can't drift out of date. */}
        <StatList>
          <StatListItem value={String(people.length)} label="Core team" />
          <StatListItem
            value={String(siteConfig.founded)}
            label="Founded"
          />
          <StatListItem
            value={`${yearsActive} yrs`}
            label="In development"
          />
        </StatList>
      </Container>

      <Team />

      <ContactSection />
    </>
  )
}