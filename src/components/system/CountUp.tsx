import { useEffect, useRef, useState } from 'react'

/**
 * COUNTUP — a number that earns its value.
 * Springs from 0 to `to` the first time it scrolls into view, with an
 * ease-out curve so it settles rather than stops. Honors reduced motion
 * by rendering the final value immediately. Tabular numerals via the
 * caller's CSS keep the digits from jittering as they count.
 */
export function CountUp({
  to,
  duration = 1600,
  delay = 0,
  className = '',
}: {
  to: number
  duration?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setValue(to)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || startedRef.current) return
        startedRef.current = true
        io.disconnect()

        const t0 = performance.now() + delay
        const tick = (now: number) => {
          const t = Math.min(Math.max((now - t0) / duration, 0), 1)
          // cubic ease-out — fast start, gentle landing
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(to * eased))
          if (t < 1) rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      // a running loop is stopped here on unmount; startedRef only prevents
      // the observer from (re)starting one — it must not fake-cancel rAF
      rafRef.current && cancelAnimationFrame(rafRef.current)
      io.disconnect()
    }
  }, [to, duration, delay])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('en-PH')}
    </span>
  )
}
