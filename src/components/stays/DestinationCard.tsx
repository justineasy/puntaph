import { Link } from 'react-router-dom'
import type { Destination } from '../../types'
import { destImage, srcSetFor } from '../../data/images'
import { IconArrowUpRight } from '../system/Icons'
import { Reveal } from '../system/Reveal'
import { useTilt } from '../../hooks/useTilt'
import './destcard.css'

export default function DestinationCard({
  dest,
  size = 'md',
  delay = 0,
}: {
  dest: Destination
  size?: 'md' | 'lg'
  delay?: number
}) {
  const tiltRef = useTilt<HTMLAnchorElement>(3)
  // lg = 2-col home grid (≈45vw); md = 3/4-col grids (31vw) that drop to
  // 2-col ≤1100px and 1-col ≤860px — each branch upper-bounds the real width.
  const sizes =
    size === 'lg'
      ? '(max-width: 860px) 92vw, 45vw'
      : '(max-width: 860px) 92vw, (max-width: 1100px) 45vw, 31vw'

  return (
    <Reveal delay={delay} variant="img">
      <Link
        ref={tiltRef}
        to={`/explore?where=${encodeURIComponent(dest.name)}`}
        className={`dest-card dest-card--${size} zoom-target`}
        aria-label={`${dest.name} — ${dest.line}`}
      >
        <div className="card-media dest-media">
          <img
            src={destImage(dest.id)}
            srcSet={srcSetFor(destImage(dest.id))}
            sizes={sizes}
            alt={`${dest.name} landscape`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="dest-overlay">
          <div>
            <h3 className="dest-name">{dest.name}</h3>
            <p className="dest-line">{dest.line}</p>
          </div>
          <span className="dest-arrow" aria-hidden="true">
            <IconArrowUpRight />
          </span>
        </div>
        <span className="tilt-glare" aria-hidden="true" />
      </Link>
    </Reveal>
  )
}
