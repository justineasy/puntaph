import type { Review, Stay } from '../types'

/**
 * Deterministic review generation — same stay always yields the same
 * reviews, so the UI never shuffles between visits.
 */

const AUTHORS = [
  'Mika', 'Jong', 'Andrea', 'Paolo', 'Rissa', 'Tofi', 'Camille', 'Enzo',
  'Dara', 'Nico', 'Selena', 'Ram', 'Tin', 'Kaye', 'Luis', 'Marga',
  'Bea', 'Franco', 'Ayen', 'Diego', 'Chesca', 'Igo', 'Lala', 'Migs',
]

const OPENERS = [
  'Worth every peso.',
  'We didn’t want to leave.',
  'Exactly as promised.',
  'Our third time back.',
  'Photos don’t do it justice.',
  'A quiet kind of special.',
  'The host thought of everything.',
  'We slept better than we have in months.',
]

const MIDDLES = [
  'The space is calm and considered — nothing extra, nothing missing.',
  'Woke up early every day just to sit outside with coffee.',
  'Check-in was seamless and the welcome note was a lovely touch.',
  'The location is unbeatable; we barely used the car.',
  'Every corner of the place feels cared for.',
  'The kitchen is better equipped than our own at home.',
  'It rained half the trip and it was still perfect.',
  'The neighborhood is friendly and everything is walkable.',
]

const CLOSERS = [
  'Already planning the return.',
  'We’ll be back with the whole family.',
  'Highly recommend for a slow weekend.',
  'Book it before someone else does.',
  'One of our favorite stays ever.',
  'Thank you for sharing this place.',
  'Ten out of ten, no notes.',
  'This is what vacations are supposed to feel like.',
]

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt * 7919) % arr.length]
}

export function reviewsFor(stay: Stay): Review[] {
  const seed = hash(stay.id)
  const count = 4
  const out: Review[] = []
  for (let i = 0; i < count; i++) {
    const s = seed + i * 4093
    // ratings cluster near the property's overall rating
    const delta = ((s % 7) - 3) / 10
    const rating = Math.min(5, Math.max(3.5, Math.round((stay.rating + delta) * 10) / 10))
    out.push({
      author: `${pick(AUTHORS, s, 1)} ${pick(['D.', 'S.', 'R.', 'M.', 'L.', 'C.'], s, 2)}`,
      date: pick(
        ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'December 2025'],
        s,
        3,
      ),
      rating,
      text: `${pick(OPENERS, s, 4)} ${pick(MIDDLES, s, 5)} ${pick(CLOSERS, s, 6)}`,
    })
  }
  return out
}

export function ratingBuckets(stay: Stay): { label: string; score: number }[] {
  const seed = hash(stay.id + 'buckets')
  const jitter = (n: number) => ((seed >> n) % 6) / 20 // 0 … 0.25
  const clamp = (v: number) => Math.min(5, Math.round(v * 20) / 20)
  return [
    { label: 'Cleanliness', score: clamp(stay.rating + jitter(0)) },
    { label: 'Accuracy', score: clamp(stay.rating + 0.05 - jitter(2)) },
    { label: 'Check-in', score: clamp(stay.rating + 0.1 - jitter(4)) },
    { label: 'Communication', score: clamp(stay.rating + 0.05 - jitter(6)) },
    { label: 'Location', score: clamp(stay.rating - jitter(1)) },
    { label: 'Value', score: clamp(stay.rating - 0.1 + jitter(3)) },
  ]
}
