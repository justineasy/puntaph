import { useEffect, useRef, useState } from 'react'
import './backtotop.css'

/**
 * BACK TO TOP — a quiet escalator home.
 *
 * Appears after the visitor is properly into the page, shows live scroll
 * progress as a ring drawn around its rim (the classic "how far down am
 * I" cue), and glides the page back to the top on click. Hidden entirely
 * when there's nothing to scroll, on touch devices near the mobile nav,
 * and for reduced-motion users it jumps instead of glides.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onScroll = () => {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = window.requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const y = window.scrollY

        // show once the hero is well behind, hide at the top
        setVisible(y > window.innerHeight * 0.8 && max > 0)
        setProgress(max > 0 ? Math.min(y / max, 1) : 0)

        // reduced motion: still show the button, but no ring to animate
        if (reduced) setProgress(0)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  // the ring: SVG circle with a rotated stroke-dash trick
  const R = 20
  const C = 2 * Math.PI * R
  const dash = C * progress

  return (
    <button
      type="button"
      className={`btt${visible ? ' is-visible' : ''}`}
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg
        className="btt-ring"
        viewBox="0 0 48 48"
        aria-hidden="true"
        // -90° start = ring begins at 12 o'clock, not 3 o'clock
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle className="btt-ring-track" cx="24" cy="24" r={R} />
        <circle
          className="btt-ring-fill"
          cx="24"
          cy="24"
          r={R}
          strokeDasharray={`${dash} ${C - dash}`}
        />
      </svg>
      <svg className="btt-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 19V6M6 11.5L12 5.5l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
