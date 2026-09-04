/**
 * Media registry.
 *
 * TO ADD A NEW VIDEO OR RECORDING: add one object to `mediaItems` below and
 * you're done — it appears in the carousel on /media and (if `featured: true`)
 * on the home page. No component changes needed.
 */

export type MediaCategory = 'demo' | 'presentation' | 'press'

export const mediaCategories: Array<{
  id: MediaCategory | 'all'
  label: string
}> = [
  { id: 'all', label: 'All' },
  { id: 'demo', label: 'Product' },
  { id: 'presentation', label: 'Talks & briefings' },
  { id: 'press', label: 'Press' },
]

export interface MediaItem {
  /** Stable slug. Used for React keys and deep links (/media#slug). */
  id: string
  title: string
  description: string
  category: MediaCategory
  /** ISO date, YYYY-MM or YYYY-MM-DD. Used for sorting and display. */
  date: string
  /** Where the recording was given, e.g. 'SOMSA 2025'. Optional. */
  venue?: string
  /** Runtime as displayed, e.g. '4:12'. Optional — videos only. */
  duration?: string
  /** Show on the home page carousel. */
  featured?: boolean
  source:
    | { provider: 'youtube'; videoId: string }
    | { provider: 'vimeo'; videoId: string }
    /** Self-hosted MP4 in /public/media. Best for footage you don't want on YouTube. */
    | { provider: 'file'; src: string; poster: string }
    /** Static photo in /public/media (or a remote URL). Opens in a lightbox. */
    | { provider: 'image'; src: string }
  /**
   * Optional local thumbnail in /public/media. Falls back to the provider's
   * auto-generated thumbnail (or, for images, the image itself).
   */
  poster?: string
}

export const mediaItems: MediaItem[] = [
  {
    id: 'towster-pod-overview',
    title: 'TOWSTER Pod: system overview',
    description:
      'How the pod moves a casualty through a submerged transit while maintaining hyperbaric pressure, temperature control, and continuous vitals telemetry.',
    category: 'presentation',
    date: '2023-01',
    duration: '2:38',
    featured: true,
    source: { provider: 'youtube', videoId: 'G2zKD8OCK1o' },
  },
  {
    id: 'V1-prototype-2026',
    title: 'V1 Prototype',
    description: 'Initial prototype of the Towster Pod.',
    category: 'demo',
    date: '2026-06',
    duration: '3:22',
    featured: true,
    source: { provider: 'image', src: 'media/V1Prototype.png' },
  },
  {
    id: 'V2-prototype-2026',
    title: 'XTech Video Submission',
    description: 'Introducing the Towster Pod: a Thermoregulated CASEVAC Pod with Closed Loop Life Support Systems.',
    category: 'presentation',
    date: '2026-08',
    featured: true,
    source: { provider: 'vimeo', videoId: '1218881321' },
    poster: '/media/xtech_video_poster.png',
  },
]

export const sortedMedia = [...mediaItems].sort((a, b) =>
  b.date.localeCompare(a.date),
)

export const featuredMedia = sortedMedia.filter((item) => item.featured)

export function embedUrl(item: MediaItem, autoplay = true): string | null {
  const auto = autoplay ? '1' : '0'
  switch (item.source.provider) {
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${item.source.videoId}?autoplay=${auto}&rel=0&modestbranding=1&playsinline=1`
    case 'vimeo':
      return `https://player.vimeo.com/video/${item.source.videoId}?autoplay=${auto}&dnt=1`
    case 'file':
    case 'image':
      return null
  }
}

export function posterUrl(item: MediaItem): string {
  if (item.poster) return item.poster
  if (item.source.provider === 'file') return item.source.poster
  if (item.source.provider === 'image') return item.source.src
  if (item.source.provider === 'youtube') {
    return `https://i.ytimg.com/vi/${item.source.videoId}/maxresdefault.jpg`
  }
  return '/media/placeholder.jpg'
}

/** True for anything that plays inline (YouTube/Vimeo/self-hosted MP4). */
export function isVideoItem(item: MediaItem): boolean {
  return item.source.provider !== 'image'
}

export function formatMediaDate(date: string): string {
  const [year, month] = date.split('-')
  if (!month) return year
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

/* ─────────────────────────────────────────────────────────────────────────
 * Abbreviated slide deck
 *
 * TO UPDATE THE DECK: export slides as images into /public/deck and update the
 * array below. From a PDF:
 *   pdftoppm -jpeg -r 150 -f 1 -l 8 deck.pdf public/deck/slide
 * Keep this to 6–10 slides. The full deck stays behind the request form.
 * ───────────────────────────────────────────────────────────────────────── */

export interface Slide {
  src: string
  /** Shown under the slide and used as the alt text. Write it as a sentence. */
  caption: string
  /** Short label for the thumbnail rail. */
  label: string
}

export const deckSlides: Slide[] = [
  {
    src: '/deck/slide-01.png',
    label: 'The system',
    caption:
      'A thermoregulated CASEVAC pod with closed-loop life support, platform-agnostic across UAV, UGV, USV, and UUV carriers.',
  },
  {
    src: '/deck/slide-02.png',
    label: 'The Problem',
    caption:
      'In contested maritime and Arctic operations, evacuation can be denied for hours or days. Today\u2019s CASEVAC assumes a medic and a ride. In that fight, both are gone.',
  },
  {
    src: '/deck/slide-03.png',
    label: 'The Solution',
    caption:
      'The goal is to provide in-transport life support during CASEVAC, thus extending the golden hour.',
  },
  {
    src: '/deck/slide-04.png',
    label: 'Construction',
    caption:
      'Whitewater-grade urethane-coated fabric, heat-welded seams, and RF-welded hardware. Version 3 moves to Dyneema and Vectran. Made in the USA, Berry Amendment aligned.',
  },
  {
    src: '/deck/slide-05.png',
    label: 'Collapsable',
    caption:
      'Designed to be collapsable and transportable for easy access regardless of the environment.',
  },
  {
    src: '/deck/slide-06.png',
    label: 'Sealed Closure',
    caption:
      'A dual YKK Proseal closure rated to 10 meters of seawater, with an outer zipper that offloads hoop stress. A casualty can seal themselves in and self-extricate.',
  },
  {
    src: '/deck/slide-07.png',
    label: 'Life Support & Telemetry',
    caption:
      'Device-agnostic integration with fielded ventilation, oxygen, and vitals monitoring hardware which communicates with the receiving role of care over tactical radio or SATCOM.',
  },
  {
    src: '/deck/slide-08.png',
    label: 'Status',
    caption:
      'Prototype V2 in build, with platform interface, medical device integration, and field testing with UGV and UAV partners planned for late 2026.',
  },
]