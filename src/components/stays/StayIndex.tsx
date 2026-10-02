import { Link } from 'react-router-dom'
import type { Stay } from '../../types'
import { nightly } from '../../lib/pricing'
import { useApp } from '../../state/AppContext'
import { useSession } from '../../state/SessionContext'
import { useRegion } from '../../state/RegionContext'
import { IconHeart, IconStar } from '../system/Icons'
import { srcSetFor } from '../../data/images'
import './stayindex.css'

/**
 * THE INDEX — every stay on Punta as one calm, sortable list.
 * Rows, not cards: a thumbnail, the essentials, the price. Built for
 * scanning the whole collection at speed. Sorting lives in the sticky
 * filter bar above (always reachable on a 50+ row list).
 */
export default function StayIndex({ stays }: { stays: Stay[] }) {
  const { isSaved, toggleSave } = useApp()
  const { isMember, priceMultiplier } = useSession()
  const { money } = useRegion()

  return (
    <section className="idx">
      {/* column headers — the table-of-contents moment */}
      <div className="idx-cols" aria-hidden="true">
        <span>Property</span>
        <span className="idx-cols-price">Nightly rate</span>
        <span />
      </div>

      <ul className="idx-list">
        {stays.map((s) => {
          const saved = isSaved(s.id)
          return (
            <li key={s.id} className="idx-row">
              <Link
                to={`/stay/${s.id}`}
                className="idx-link"
                aria-label={`${s.name}, ${s.location} — ${money(s.price)} per night`}
              >
                <span className="idx-thumb">
                  <img
                    src={s.images[0]}
                    srcSet={srcSetFor(s.images[0], [120, 250, 330, 500])}
                    sizes="(max-width: 640px) 84px, (max-width: 900px) 96px, 132px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="idx-main">
                  <span className="idx-top">
                    <span className="idx-name">{s.name}</span>
                    <span className="rating idx-rating">
                      <IconStar /> {s.rating.toFixed(2)}
                      <span className="idx-reviews"> · {s.reviews}</span>
                    </span>
                  </span>
                  <span className="idx-loc">{s.location}</span>
                  <span className="idx-line">{s.tagline}</span>
                </span>
              </Link>

              <span className="idx-price">
                {isMember && <s className="idx-was">{money(s.price)}</s>}
                <span className="price">{money(nightly(s, priceMultiplier))}</span>
                <small> / night</small>
              </span>

              <button
                type="button"
                className={`heart idx-heart${saved ? ' is-saved' : ''}`}
                aria-pressed={saved}
                aria-label={saved ? `Remove ${s.name} from wishlist` : `Save ${s.name} to wishlist`}
                onClick={() => toggleSave(s.id)}
              >
                <IconHeart filled={saved} />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
