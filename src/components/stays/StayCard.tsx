import { Link } from 'react-router-dom'
import type { Stay } from '../../types'
import { nightly } from '../../lib/pricing'
import { useApp } from '../../state/AppContext'
import { useSession } from '../../state/SessionContext'
import { useRegion } from '../../state/RegionContext'
import { IconArrowUpRight, IconHeart, IconStar } from '../system/Icons'
import { srcSetFor } from '../../data/images'
import './staycard.css'

/**
 * `sizes` is context-aware: the default matches the 3-col grids that go
 * 2-col ≤1100px (wishlist/destinations) and 1-col ≤860px. Rails pass an
 * exact pixel width so the browser never over-fetches for the narrow card.
 */
const GRID_SIZES = '(max-width: 860px) 92vw, (max-width: 1100px) 45vw, 31vw'
export const RAIL_SIZES = '(max-width: 860px) 300px, 330px'

export default function StayCard({
  stay,
  eager = false,
  sizes = GRID_SIZES,
}: {
  stay: Stay
  eager?: boolean
  sizes?: string
}) {
  const { isSaved, toggleSave } = useApp()
  const { isMember, priceMultiplier } = useSession()
  const { money } = useRegion()
  const saved = isSaved(stay.id)
  const rate = nightly(stay, priceMultiplier)

  return (
    <article className="stay-card">
      <div className="card-media zoom-host">
        <Link
          to={`/stay/${stay.id}`}
          className="zoom-target"
          aria-label={`${stay.name}, ${stay.location}`}
        >
          <img
            src={stay.images[0]}
            srcSet={srcSetFor(stay.images[0])}
            sizes={sizes}
            alt={`${stay.name} — exterior view`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>
        {/* the view affordance lives IN the photograph — a quiet pill,
            never overlapping the info below */}
        <span className="card-view" aria-hidden="true">
          View stay <IconArrowUpRight />
        </span>
        {stay.guestFavorite && (
          <span className="tag tag--dark card-flag">Guest favorite</span>
        )}
        <button
          type="button"
          className={`heart card-heart${saved ? ' is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${stay.name} from wishlist` : `Save ${stay.name} to wishlist`}
          onClick={() => toggleSave(stay.id)}
        >
          <IconHeart filled={saved} />
        </button>
      </div>

      <div className="stay-card-info">
        <div className="stay-card-top">
          <h3 className="stay-card-name">{stay.name}</h3>
          <span className="rating">
            <IconStar /> {stay.rating.toFixed(2)}
          </span>
        </div>
        <p className="stay-card-loc">{stay.location}</p>
        <p className="stay-card-line">{stay.tagline}</p>
        <p className="stay-card-price">
          {isMember && rate < stay.price && <s className="stay-card-was">{money(stay.price)}</s>}
          <span className="price">{money(rate)}</span> <small>/ night</small>
        </p>
      </div>
    </article>
  )
}
