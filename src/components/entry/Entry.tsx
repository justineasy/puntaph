import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'
import { PuntaLoader } from '../system/Skeletons'
import './entry.css'

/**
 * PART 1 — CINEMATIC ENTRY
 * Timeline (full motion):
 *   0.0  near-black + grain
 *   0.5  a point of light
 *   1.0  lines draw an abstract doorway / horizon
 *   2.4  PUNTA wordmark
 *   2.8  tagline
 *   3.2  structure expands, landscape blooms through the door
 *   4.0  dissolve into homepage (already mounted underneath)
 *
 * The homepage is mounted underneath the whole time — the entry never
 * delays the site itself, it only delays its reveal.
 *
 * The full cinematic plays once per browser session. Returning visitors
 * (and reduced-motion devices) get the brand mark for 450ms instead —
 * the same PUNTA lockup the inline boot loader paints, so a refresh
 * reads as one continuous logo from first paint to first page.
 * Skippable at any time.
 */

const FULL_MS = 4000
const REDUCED_MS = 450
const SEEN_KEY = 'punta.entry.seen.v1'

function entrySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/** The drawn doorway and wordmark — only mounted on the full cinematic. */
function EntryCinematic() {
  return (
    <>
      <svg
        className="entry-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="entry-glow" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#f4f0e8" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#f4f0e8" stopOpacity="0.045" />
            <stop offset="100%" stopColor="#f4f0e8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="entry-bloom" cx="50%" cy="52%" r="62%">
            <stop offset="0%" stopColor="#efe6d3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#efe6d3" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="entry-bloomcircle" cx="800" cy="468" r="600" fill="url(#entry-bloom)" />
        <g className="entry-lines" fill="none" stroke="#f4f0e8" strokeWidth="1.4" strokeLinecap="round">
          <path className="ln ln-horizon" d="M120 560 H1480" />
          <path className="ln ln-roof" d="M560 560 L800 372 L1040 560" />
          <path className="ln ln-door" d="M752 560 V462 A48 48 0 0 1 848 462 V560" />
          <g className="entry-lines-dark" fill="none" stroke="#1c1a16" strokeWidth="1.4" strokeLinecap="round">
            <path className="ln ln-room" d="M672 560 V478 H928 V560" />
            <path className="ln ln-coast" d="M1040 560 C1160 552 1240 540 1480 574" />
            <circle className="ln ln-sun" cx="800" cy="372" r="6" />
          </g>
        </g>
        <circle className="entry-glowcircle" cx="800" cy="430" r="340" fill="url(#entry-glow)" />
      </svg>

      <div className="entry-center" aria-hidden="true">
        <h1 className="entry-wordmark">PUNTA</h1>
        <p className="entry-tagline">Where will you stay?</p>
      </div>
    </>
  )
}

export default function Entry({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  // full cinematic once per session — returning visits skip straight in
  const [quick] = useState(() => reduced || entrySeen())
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setExiting(true)
    // reveal the site beneath while the overlay fades — a true cross-fade
    onDone()
    // must outlast the exit (delay + duration, see entry.css): the overlay
    // is only unmounted once its fade is genuinely finished
    window.setTimeout(() => setGone(true), quick ? 900 : 1000)
  }, [onDone, quick])

  useEffect(() => {
    document.body.classList.add('entry-lock')
    window.scrollTo(0, 0)
    return () => document.body.classList.remove('entry-lock')
  }, [])

  // release the scroll lock the moment the overlay is gone — the overlay
  // unmounts only visually (renders null), never physically, so waiting
  // for the unmount cleanup would lock scrolling forever
  useEffect(() => {
    if (gone) document.body.classList.remove('entry-lock')
  }, [gone])

  useEffect(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage unavailable — the cinematic simply plays each visit */
    }
    const t = window.setTimeout(finish, quick ? REDUCED_MS : FULL_MS)
    return () => window.clearTimeout(t)
  }, [finish, quick])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish])

  if (gone) return null

  // No role="img" on the root: that role made every descendant
  // presentational — including the Skip button, dropping it from the
  // accessibility tree. The cinematic already exposes the real h1 +
  // tagline; the quick path's loader is aria-hidden, so it carries its
  // own sr-only status instead.
  return (
    <div
      id="entry-root"
      className={`entry${exiting ? ' is-exiting' : ''}${quick ? ' is-reduced' : ''}`}
    >
      <div className="entry-grain" aria-hidden="true" />
      <div className="entry-vignette" aria-hidden="true" />

      {/* The short path never mounts the cinematic — and never leaves the
          visitor staring at a bare dark screen. It shows the brand mark,
          matching the inline boot loader it just replaced, so the logo
          reads as one continuous loader. */}
      {quick ? (
        <>
          <PuntaLoader size="lg" tone="dark" tagline="Where will you stay?" />
          <span className="sr-only" role="status">Loading PUNTA — Where will you stay?</span>
        </>
      ) : (
        <EntryCinematic />
      )}

      <button type="button" className="entry-skip" onClick={finish}>
        Skip
      </button>

      <span className="entry-progress" aria-hidden="true">
        <span />
      </span>
    </div>
  )
}
