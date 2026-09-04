'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { GridPattern } from '@/components/GridPattern'

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m5.636 4.223 14.142 14.142-1.414 1.414L4.222 5.637z" />
      <path d="M4.222 18.363 18.364 4.22l1.414 1.414L5.636 19.777z" />
    </svg>
  )
}

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M2 6h20v2H2zM2 16h20v2H2z" />
    </svg>
  )
}

function Header({
  panelId,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
  invert = false,
}: {
  panelId: string
  icon: React.ComponentType<{ className?: string }>
  expanded: boolean
  onToggle: () => void
  toggleRef: React.RefObject<HTMLButtonElement>
  invert?: boolean
}) {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="TOWSTER Corporation, home">
          <Image
            className="w-60 h-auto"
            src="/towster-logo.png"
            alt="TOWSTER Corporation"
            priority
            width={1200}
            height={400}
          />
        </Link>
        <div className="flex items-center gap-x-8">
          <Button href="/contact" invert={invert}>
            Contact
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded ? 'true' : 'false'}
            aria-controls={panelId}
            className={clsx(
              'group -m-2.5 rounded-full p-2.5 transition',
              invert ? 'hover:bg-white/10' : 'hover:bg-neutral-950/10',
            )}
            aria-label={expanded ? 'Close navigation' : 'Open navigation'}
          >
            <Icon
              className={clsx(
                'h-6 w-6',
                invert
                  ? 'fill-white group-hover:fill-neutral-200'
                  : 'fill-neutral-950 group-hover:fill-neutral-700',
              )}
            />
          </button>
        </div>
      </div>
    </Container>
  )
}

function NavigationRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="even:mt-px sm:bg-neutral-950">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
      </Container>
    </div>
  )
}

function NavigationItem({
  href,
  children,
  description,
}: {
  href: string
  children: React.ReactNode
  description?: string
}) {
  let pathname = usePathname()
  let current = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className="group relative isolate -mx-6 bg-neutral-950 px-6 py-10 even:mt-px sm:mx-0 sm:px-0 sm:py-16 sm:odd:pr-16 sm:even:mt-0 sm:even:border-l sm:even:border-neutral-800 sm:even:pl-16"
    >
      <span className={clsx(current && 'text-white/60')}>{children}</span>
      {description ? (
        <span className="mt-3 block max-w-sm font-sans text-base font-normal tracking-normal text-neutral-400">
          {description}
        </span>
      ) : null}
      <span className="absolute inset-y-0 -z-10 w-screen bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
    </Link>
  )
}

/**
 * Items come in pairs — the grid is two columns and the odd/even selectors
 * above handle the divider and hover fill. Adding an odd number of items
 * leaves a visible half-empty row, which is what the single "Products" item
 * was doing before.
 */
function Navigation() {
  return (
    <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/work" description="Specifications and configurations">
          The System
        </NavigationItem>
        <NavigationItem href="/media" description="Video, briefings, and the overview deck">
          Media
        </NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href="/about" description="Who builds it and why">
          Company
        </NavigationItem>
        <NavigationItem href="/contact" description="Program, partnership, or press">
          Contact
        </NavigationItem>
      </NavigationRow>
    </nav>
  )
}

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  let panelId = useId()
  let [expanded, setExpanded] = useState(false)
  let openRef = useRef<HTMLButtonElement>(null)
  let closeRef = useRef<HTMLButtonElement>(null)
  let navRef = useRef<HTMLDivElement>(null)
  let shouldReduceMotion = useReducedMotion()

  // Close when a link points at the page we're already on.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('a')?.href === window.location.href
      ) {
        setExpanded(false)
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  // Escape closes the panel and returns focus to the button that opened it.
  // Without this, keyboard users who open the menu have no way out but Tab.
  useEffect(() => {
    if (!expanded) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpanded(false)
        openRef.current?.focus({ preventScroll: true })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded])

  return (
    <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
      <a
        href="#main"
        className="sr-only z-50 focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:rounded-full focus:bg-neutral-950 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header>
        <div
          className="absolute left-0 right-0 top-2 z-40 pt-14"
          aria-hidden={expanded ? 'true' : undefined}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? '' : undefined}
        >
          <Header
            panelId={panelId}
            icon={MenuIcon}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setExpanded((expanded) => !expanded)
              window.setTimeout(() =>
                closeRef.current?.focus({ preventScroll: true }),
              )
            }}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '0.5rem' }}
          className="relative z-50 overflow-hidden bg-neutral-950 pt-2"
          aria-hidden={expanded ? undefined : 'true'}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? undefined : ''}
        >
          <motion.div layout className="bg-neutral-800">
            <div ref={navRef} className="bg-neutral-950 pb-16 pt-14">
              <Header
                invert
                panelId={panelId}
                icon={XIcon}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setExpanded((expanded) => !expanded)
                  window.setTimeout(() =>
                    openRef.current?.focus({ preventScroll: true }),
                  )
                }}
              />
            </div>
            <Navigation />
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-14"
      >
        <motion.div layout className="relative isolate flex w-full flex-col pt-9">
          <GridPattern
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-neutral-100 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
            yOffset={-96}
            interactive
          />

          <main id="main" className="w-full flex-auto">
            {children}
          </main>

          <Footer />
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()

  return <RootLayoutInner key={pathname}>{children}</RootLayoutInner>
}