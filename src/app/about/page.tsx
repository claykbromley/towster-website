import { type Metadata } from 'next'
import Image from 'next/image'

import { Border } from '@/components/Border'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { PageLinks } from '@/components/PageLinks'
import { StatList, StatListItem } from '@/components/StatList'
import Yousef_Ahmed from '@/images/team/Towster Corporation Icon.svg'
import Andre_Savadjian from '@/images/team/Andre_Savadjian.jpg'
import Matt_Brendel from '@/images/team/Matt_Brendel.jpg'
import Rodney_Brenneman from '@/images/team/Rodney_Brenneman.jpg'
import Jacob_Becker from '@/images/team/Jacob_Becker.jpg'
import Clayton_Bromley from '@/images/team/Clayton_Bromley.jpg'
import { loadArticles } from '@/lib/mdx'

const team = [
  {
    title: 'Team',
    people: [
      {
        name: 'Yousef Ahmed, M.D.',
        role: 'Co-Founder/CEO',
        image: { src: Yousef_Ahmed },
      },
      {
        name: 'Andre Savadjian, M.D.',
        role: 'Co-Founder/COO',
        image: { src: Andre_Savadjian },
      },
      {
        name: 'Matt Brendel',
        role: 'Chief Financial Officer',
        image: { src: Matt_Brendel },
      },
      {
        name: 'Rodney Brenneman',
        role: 'Business Manager',
        image: { src: Rodney_Brenneman },
      },
      {
        name: 'Clayton Bromley',
        role: 'Co-Founder/Technical Advisor',
        image: { src: Clayton_Bromley },
      },
      {
        name: 'Jacob Becker',
        role: 'Co-Founder/Technical Advisor',
        image: { src: Jacob_Becker },
      },
    ],
  },
]

function Team() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <div className="space-y-24">
        {team.map((group) => (
          <FadeInStagger key={group.title}>
            <Border as={FadeIn} />
            <div className="grid grid-cols-1 gap-6 pt-12 sm:pt-16 lg:grid-cols-4 xl:gap-8">
              <FadeIn>
                <h2 className="font-display text-2xl font-semibold text-neutral-950">
                  {group.title}
                </h2>
              </FadeIn>
              <div className="lg:col-span-3">
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                >
                  {group.people.map((person, index) => (
                    <li key={person.name}>
                      <FadeIn>
                        <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
                          <Image
                            alt=""
                            {...person.image}
                            className="h-96 w-full object-cover grayscale transition duration-500 motion-safe:group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-black/0 to-40% p-6">
                            <p className="font-display text-base/6 font-semibold tracking-wide text-white text-center">
                              {person.name}
                            </p>
                            <p className="mt-2 text-sm text-white text-center">
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
        ))}
      </div>
    </Container>
  )
}

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'We believe that our strength lies in our collaborative approach, which puts our clients at the center of everything we do.',
}

export default async function About() {
  let blogArticles = (await loadArticles()).slice(0, 1)

  return (
    <>
      <PageIntro eyebrow="About us" title="Our strength is our experience">
        <p>
          TOWSTER Corporation was officially formed in September 2023 during the
          design of the TOWSTER Pod. The founding team, led by CEO Dr. Yousef
          Ahmed, was assembled in 2023 through various connections in the US
          Navy. As a Critical Care Anesthesiologist and LCDR USN, Dr. Ahmed
          first worked on a modified ventilation design before recognizing the
          benefits of transportable HBOT. The founding team has applied for
          grant funding and is now working to develop a prototype of the TOWSTER
          Pod.
        </p>
      </PageIntro>
      <Container className="mt-16">
        <StatList>
          <StatListItem value="13" label="Team Size" />
        </StatList>
      </Container>

      <Team />

      <PageLinks
        className="mt-24 sm:mt-32 lg:mt-40"
        title="From the newsroom"
        intro="Latest news and article from TOWSTER Corporation"
        pages={blogArticles}
      />

      <ContactSection />
    </>
  )
}
