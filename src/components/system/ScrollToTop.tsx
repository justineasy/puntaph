import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll to top on navigation — arrivals start at the beginning. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
