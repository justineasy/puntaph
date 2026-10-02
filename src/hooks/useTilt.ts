import { useCallback, useEffect, useRef } from 'react'

/**
 * useTilt — a whisper of 3D. Cards ease a few degrees toward the cursor
 * with a soft glare, and settle back when it leaves. Purely additive:
 * reduced-motion devices and touch screens get a plain, still card.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 3.5) {
  const ref = useRef<T>(null)

  const onMove = useCallback(
    (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      // touch screens have no hover — never tilt for them
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const rx = (0.5 - py) * maxDeg * 2
      const ry = (px - 0.5) * maxDeg * 2
      el.style.setProperty('--tilt-x', `${rx.toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${ry.toFixed(2)}deg`)
      el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
    },
    [maxDeg],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // pointer:coarse = touch-first device; tilt is a fine-pointer delight
    if (window.matchMedia('(pointer: coarse)').matches) return

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [onMove, onLeave])

  return ref
}
