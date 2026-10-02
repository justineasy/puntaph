import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Scroll-reveal wrapper. Adds `.is-in` once when the element enters the
 * viewport. Reduced-motion devices show content instantly via CSS.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'rise',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  variant?: 'rise' | 'img' | 'line'
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const variantClass =
    variant === 'img' ? ' reveal-img' : variant === 'line' ? ' hline' : ' reveal'

  return (
    <div
      ref={ref}
      className={`${className}${variantClass}${inView ? ' is-in' : ''}`}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
