import { Link } from 'react-router-dom'
import type { Destination } from '../../types'
import { destImage } from '../../data/images'
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

  return (
    <Reveal delay={delay} variant="img">
      <Link
        ref={tiltRef}
        to={`/explore?where=${encodeURIComponent(dest.name)}`}
        className={`dest-card dest-card--${size} zoom-target`}
        aria-label={`${dest.name} — ${dest.line}`}
      >
        <div className="card-media dest-media">
          <img src={destImage(dest.id)} alt={`${dest.name} landscape`} loading="lazy" decoding="async" />
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
