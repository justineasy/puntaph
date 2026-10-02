import { Link } from 'react-router-dom'
import type { Stay } from '../../types'
import { nightly } from '../../lib/pricing'
import { useApp } from '../../state/AppContext'
import { useSession } from '../../state/SessionContext'
import { useRegion } from '../../state/RegionContext'
import { IconArrowRight, IconHeart, IconStar } from '../system/Icons'
import { Reveal } from '../system/Reveal'
import { srcSetFor } from '../../data/images'
import './overlaycard.css'

/**
 * Cinematic overlay property card — one object: full-bleed image with
 * info composed on a gradient in the lower portion. The price row lives
 * in normal document flow inside the card (no fixed/sticky/absolute-to-page),
 * so it always travels with the card on vertical and horizontal scroll.
 *
 * `featured` = large editorial treatment (bigger serif, taller media).
 */
export default function OverlayCard({
  stay,
  featured = false,
  eager = false,
  delay = 0,
}: {
  stay: Stay
  featured?: boolean
  eager?: boolean
  delay?: number
}) {
  const { isSaved, toggleSave } = useApp()
  const { isMember, priceMultiplier } = useSession()
  const { money, t } = useRegion()
  const saved = isSaved(stay.id)
  const rate = nightly(stay, priceMultiplier)
  const full = stay.price

  return (
    <Reveal delay={delay} className="ovl-wrap">
      <article className={`ovl${featured ? ' ovl--featured' : ''}`}>
        <Link
          to={`/stay/${stay.id}`}
          className="ovl-media zoom-target"
          aria-label={`${stay.name}, ${stay.location} — view stay`}
        >
          <img
            src={stay.images[0]}
            srcSet={srcSetFor(stay.images[0])}
            sizes="(max-width: 860px) 92vw, (max-width: 1100px) 45vw, 31vw"
            alt={`${stay.name} — ${stay.tagline}`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className="ovl-scrim" aria-hidden="true" />
          <div className="ovl-veil" aria-hidden="true" />

          <div className="ovl-info">
            <div className="ovl-toprow">
              <p className="ovl-loc">{stay.location}</p>
              <span className="rating ovl-rating">
                <IconStar /> {stay.rating.toFixed(2)}
              </span>
            </div>

            <h3 className={`serif ovl-name${featured ? ' ovl-name--lg' : ''}`}>{stay.name}</h3>
            <p className="ovl-line">{stay.tagline}</p>

            {/* price row — normal flow, belongs to the card.
                Only the featured card gets a text CTA; standard cards
                answer with a quiet arrow — no repeated micro-labels. */}
            <div className="ovl-pricerow">
              <p className="ovl-price">
                {isMember && rate < full && <s className="ovl-was">{money(full)}</s>}
                <span className="price">{money(rate)}</span>
                <small> {t('card.night')}</small>
              </p>
              {featured ? (
                <span className="ovl-cta" aria-hidden="true">
                  View stay <IconArrowRight />
                </span>
              ) : (
                <span className="ovl-go" aria-hidden="true">
                  <IconArrowRight />
                </span>
              )}
            </div>
          </div>
        </Link>

        {stay.guestFavorite && (
          <span className="tag tag--dark ovl-flag">Guest favorite</span>
        )}

        <button
          type="button"
          className={`heart ovl-heart${saved ? ' is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${stay.name} from wishlist` : `Save ${stay.name} to wishlist`}
          onClick={() => toggleSave(stay.id)}
        >
          <IconHeart filled={saved} />
        </button>
      </article>
    </Reveal>
  )
}
