'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { FadeIn } from '@/components/FadeIn'
import type { Slide } from '@/lib/media'

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SlideDeck({
  slides,
  downloadUrl,
  requestUrl = '/contact?inquiry=investment',
}: {
  slides: Slide[]
  downloadUrl?: string
  requestUrl?: string
}) {
  const [index, setIndex] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const railItems = useRef<Array<HTMLButtonElement | null>>([])

  const go = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(slides.length - 1, next)))
    },
    [slides.length],
  )

  // Keep the active thumbnail in view when navigating by keyboard.
  useEffect(() => {
    railItems.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [index])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      go(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      go(slides.length - 1)
    }
  }

  if (slides.length === 0) return null

  const current = slides[index]

  return (
    <FadeIn>
      <div
        ref={stage}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="carousel"
        aria-label="Abbreviated overview deck"
        className="rounded-3xl bg-neutral-950 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4 sm:p-6"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-900">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              aria-hidden={i !== index}
              className={clsx(
                'absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none',
                i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <Image
                src={slide.src}
                alt={slide.caption}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority={i === 0}
                className="object-contain"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-950 transition hover:bg-white disabled:pointer-events-none disabled:opacity-0"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === slides.length - 1}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-950 transition hover:bg-white disabled:pointer-events-none disabled:opacity-0"
          >
            <Chevron direction="right" />
          </button>

          <p className="absolute bottom-3 right-3 rounded-full bg-neutral-950/70 px-3 py-1 font-mono text-xs tabular-nums text-white">
            {index + 1} / {slides.length}
          </p>
        </div>

        {/* Caption is a live region so screen readers announce slide changes. */}
        <p
          aria-live="polite"
          className="mt-5 min-h-[3.5rem] px-1 text-base text-neutral-300"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {current.label}
          </span>
          <span className="mt-1 block">{current.caption}</span>
        </p>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              ref={(el) => {
                railItems.current[i] = el
              }}
              type="button"
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}: ${slide.label}`}
              aria-current={i === index}
              className={clsx(
                'relative aspect-[16/9] w-24 flex-none overflow-hidden rounded-lg ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                i === index
                  ? 'ring-2 ring-white'
                  : 'opacity-50 ring-white/20 hover:opacity-90',
              )}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button href={requestUrl}>Request the full deck</Button>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline"
          >
            Download the public overview (PDF)
          </a>
        ) : null}
        <p className="text-sm text-neutral-500">
          Use ← and → to move between slides.
        </p>
      </div>
    </FadeIn>
  )
}