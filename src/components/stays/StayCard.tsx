import { Link } from 'react-router-dom'
import type { Stay } from '../../types'
import { nightly } from '../../lib/pricing'
import { useApp } from '../../state/AppContext'
import { useSession } from '../../state/SessionContext'
import { useRegion } from '../../state/RegionContext'
import { IconArrowUpRight, IconHeart, IconStar } from '../system/Icons'
import './staycard.css'

export default function StayCard({ stay, eager = false }: { stay: Stay; eager?: boolean }) {
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
