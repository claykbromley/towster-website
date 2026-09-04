'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { FadeIn } from '@/components/FadeIn'
import {
  embedUrl,
  formatMediaDate,
  mediaCategories,
  posterUrl,
  type MediaCategory,
  type MediaItem,
} from '@/lib/media'

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="11" className="fill-white/95" />
      <path d="M10 8.5v7l5.5-3.5-5.5-3.5z" className="fill-neutral-950" />
    </svg>
  )
}

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExpandIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MediaCard({
  item,
  isActive,
  onActivate,
  onDeactivate,
}: {
  item: MediaItem
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
}) {
  const isImage = item.source.provider === 'image'
  const src = embedUrl(item)

  return (
    <article
      id={item.id}
      className="flex w-[85vw] flex-none snap-start flex-col sm:w-[60vw] lg:w-[calc((100%-2rem)/2)]"
    >
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-neutral-900 ring-1 ring-neutral-950/10">
        {isImage ? (
          <button
            type="button"
            onClick={onActivate}
            className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl(item)}
              alt={item.description}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-neutral-950/0 transition group-hover:bg-neutral-950/20" />
            <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950/70 text-white opacity-0 transition group-hover:opacity-100">
              <ExpandIcon className="h-4 w-4" />
            </span>
            <span className="sr-only">View full size: {item.title}</span>
          </button>
        ) : !isActive ? (
          <button
            type="button"
            onClick={onActivate}
            className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl(item)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition duration-500 motion-safe:group-hover:scale-105 motion-safe:group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayIcon className="h-14 w-14 drop-shadow-lg transition motion-safe:group-hover:scale-110" />
            </span>
            <span className="sr-only">Play {item.title}</span>
            {item.duration ? (
              <span className="absolute bottom-4 right-4 rounded-full bg-neutral-950/80 px-2.5 py-1 font-mono text-xs tabular-nums text-white">
                {item.duration}
              </span>
            ) : null}
          </button>
        ) : item.source.provider === 'file' ? (
          <video
            controls
            autoPlay
            playsInline
            poster={posterUrl(item)}
            className="h-full w-full object-cover"
          >
            <source src={item.source.src} type="video/mp4" />
            Your browser doesn’t support embedded video.{' '}
            <a href={item.source.src}>Download the file instead.</a>
          </video>
        ) : (
          <iframe
            src={src ?? ''}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>

      <div className="mt-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-neutral-500">
          <time dateTime={item.date}>{formatMediaDate(item.date)}</time>
          {item.venue ? (
            <>
              <span aria-hidden="true" className="text-neutral-300">
                /
              </span>
              <span>{item.venue}</span>
            </>
          ) : null}
        </p>
        <h3 className="mt-3 font-display text-xl font-semibold text-neutral-950">
          {item.title}
        </h3>
        <p className="mt-2 text-base text-neutral-600">{item.description}</p>
      </div>

      {isImage && isActive ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={onDeactivate}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={onDeactivate}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.source.provider === 'image' ? item.source.src : posterUrl(item)}
            alt={item.description}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </article>
  )
}

export function MediaCarousel({
  items,
  showFilters = true,
}: {
  items: MediaItem[]
  showFilters?: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<MediaCategory | 'all'>('all')
  const [active, setActive] = useState<string | null>(null)
  const visible = filter === 'all' ? items : items.filter((i) => i.category === filter)
  const [canScroll, setCanScroll] = useState({ prev: false, next: visible.length > 2 })

  const updateArrows = useCallback(() => {
    const el = scroller.current
    if (!el) return

    const max = el.scrollWidth - el.clientWidth

    setCanScroll({
      prev: el.scrollLeft > 8,
      next: el.scrollLeft < max - 8,
    })
  }, [])

  useEffect(() => {
    updateArrows()
  }, [visible, updateArrows])

  useEffect(() => {
    if (!active) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  const scroll = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector('article')
    const step = card
      ? card.getBoundingClientRect().width + 32
      : el.clientWidth * 0.8
    el.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  const changeFilter = (next: MediaCategory | 'all') => {
    setFilter(next)
    setActive(null)
    scroller.current?.scrollTo({ left: 0 })
  }

  // Only offer filters the library actually contains, so the UI never shows an
  // empty category.
  const availableCategories = mediaCategories.filter(
    (c) => c.id === 'all' || items.some((i) => i.category === c.id),
  )

  return (
    <div>
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-6">
          {showFilters && availableCategories.length > 2 ? (
            <div
              role="tablist"
              aria-label="Filter media by type"
              className="flex flex-wrap gap-2"
            >
              {availableCategories.map((category) => {
                const selected = filter === category.id
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => changeFilter(category.id)}
                    className={clsx(
                      'rounded-full px-4 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2',
                      selected
                        ? 'bg-neutral-950 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                    )}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          ) : (
            <span />
          )}

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScroll.prev}
              aria-label="Previous videos"
              className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-neutral-950/20 transition hover:bg-neutral-950 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
            >
              <ArrowIcon className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScroll.next}
              aria-label="Next videos"
              className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-neutral-950/20 transition hover:bg-neutral-950 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
            >
              <ArrowIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </FadeIn>

      {visible.length === 0 ? (
        <FadeIn>
          <p className="mt-10 rounded-3xl bg-neutral-50 p-10 text-center text-base text-neutral-600">
            No recordings in this category yet. New briefings are posted here
            after each conference.
          </p>
        </FadeIn>
      ) : (
        <div
          ref={scroller}
          onScroll={updateArrows}
          tabIndex={0}
          role="group"
          aria-label="Video library"
          className="mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4 [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              isActive={active === item.id}
              onActivate={() => setActive(item.id)}
              onDeactivate={() => setActive(null)}
            />
          ))}
        </div>
      )}

      {visible.length > 1 ? (
        <p className="mt-2 text-sm text-neutral-500 sm:hidden">
          Swipe to see more →
        </p>
      ) : null}
    </div>
  )
}