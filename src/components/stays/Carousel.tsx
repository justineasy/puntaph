import { useCallback, useEffect, useRef, useState } from 'react'
import { IconArrowRight } from '../system/Icons'
import './carousel.css'

/**
 * Premium horizontal carousel — scroll-snap track with drag support,
 * small circular arrow controls, and edge fade. The track uses native
 * scrolling, so touch/swipe/trackpad work for free and every card is
 * one complete scrolling unit.
 */
export default function Carousel({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const dragRef = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null)
  const clickGuardRef = useRef(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  function page(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>('.carousel-item')
    // measure the real gap so the step lands exactly on the next card
    const gap = first ? parseFloat(getComputedStyle(el).columnGap || '0') : 24
    const step = first ? first.clientWidth + gap : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      page(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      page(-1)
    }
  }

  function pointerDown(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return // touch uses native scrolling
    const el = trackRef.current
    if (!el) return
    dragRef.current = { startX: e.clientX, startScroll: el.scrollLeft, moved: false }
  }

  function pointerMove(e: React.PointerEvent) {
    const drag = dragRef.current
    const el = trackRef.current
    if (!drag || !el) return
    const dx = e.clientX - drag.startX
    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true
      el.classList.add('is-dragging')
    }
    if (drag.moved) {
      clickGuardRef.current = true
      el.scrollLeft = drag.startScroll - dx
    }
  }

  function pointerUp() {
    const drag = dragRef.current
    if (drag?.moved) {
      // swallow the click that follows a drag so cards don't open accidentally
      window.setTimeout(() => (clickGuardRef.current = false), 60)
    }
    dragRef.current = null
    trackRef.current?.classList.remove('is-dragging')
  }

  function onClickCapture(e: React.MouseEvent) {
    if (clickGuardRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="carousel">
      <ul
        ref={trackRef}
        className="carousel-track"
        role="list"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerLeave={pointerUp}
        onClickCapture={onClickCapture}
      >
        {children}
      </ul>

      <div className="carousel-nav">
        <button
          type="button"
          className="carousel-btn carousel-btn--prev"
          onClick={() => page(-1)}
          disabled={!canPrev}
          aria-label="Previous properties"
        >
          <IconArrowRight />
        </button>
        <button
          type="button"
          className="carousel-btn"
          onClick={() => page(1)}
          disabled={!canNext}
          aria-label="Next properties"
        >
          <IconArrowRight />
        </button>
      </div>
    </div>
  )
}
