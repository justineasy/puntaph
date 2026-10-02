import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Thin route-progress line under the navbar. Deliberately subtle —
 * the brand never shouts "loading".
 */
export function ProgressBar() {
  const location = useLocation()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf1 = 0
    let raf2 = 0
    setWidth(8)
    setVisible(true)
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setWidth(100))
    })
    const t = window.setTimeout(() => setVisible(false), 900)
    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
      window.clearTimeout(t)
    }
  }, [location.pathname])

  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 2,
        width: `${width}%`,
        background: 'linear-gradient(90deg, var(--sand), var(--forest))',
        zIndex: 350,
        transition: 'width 0.8s var(--ease-out)',
      }}
    />
  )
}
