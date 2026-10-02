import { useMemo, useState } from 'react'
import { SectionHeading } from '../../components/system/SectionHeading'
import { Reveal } from '../../components/system/Reveal'
import { IconHeart, IconStar } from '../../components/system/Icons'
import { RESTAURANTS } from '../../data/platform'
import { useApp } from '../../state/AppContext'
import { useMyTrip } from '../../state/MyTripContext'
import '../platform.css'

const CATS = [
  'All',
  'Fine Dining',
  'Local Food',
  'Beach Restaurant',
  'Café',
  'Romantic Dining',
  'Beach Club',
  'Hidden Gem',
] as const

export default function DiningPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>('All')
  const { isSaved, toggleSave } = useApp()
  const { addItems, inTrip } = useMyTrip()

  const list = useMemo(
    () => (cat === 'All' ? RESTAURANTS : RESTAURANTS.filter((r) => r.category === cat)),
    [cat],
  )

  return (
    <div className="pl shell">
      <header className="pl-hero">
        <SectionHeading
          level={1}
          eyebrow="Dining"
          title={
            <>
              The best tables
              <br />
              on the islands
            </>
          }
          dek="From lomi houses that open at six to rooftop tasting menus — every kitchen here earned its place."
        />
      </header>

      <div className="pl-cats" role="tablist" aria-label="Dining categories">
        {CATS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            className={`chip${cat === c ? ' is-active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="pl-grid">
        {list.map((r, i) => {
          const saved = isSaved(r.id)
          const inTripAlready = inTrip(r.id)
          return (
            <Reveal key={r.id} delay={(i % 3) * 70}>
              <article className="plc">
                <span className="plc-media">
                  <img decoding="async" src={r.image} alt={r.name} loading="lazy" />
                  <button
                    type="button"
                    className={`heart plc-heart${saved ? ' is-saved' : ''}`}
                    aria-pressed={saved}
                    aria-label={saved ? `Remove ${r.name} from wishlist` : `Save ${r.name} to wishlist`}
                    onClick={() => toggleSave(r.id)}
                  >
                    <IconHeart filled={saved} />
                  </button>
                </span>
                <span className="plc-body">
                  <span className="plc-top">
                    <span className="plc-name">{r.name}</span>
                    <span className="rating plc-rating">
                      <IconStar /> {r.rating.toFixed(2)}
                      <span className="muted"> · {r.reviews}</span>
                    </span>
                  </span>
                  <span className="plc-loc">
                    {r.location} · {'₱'.repeat(r.priceRange)} · {r.cuisine}
                  </span>
                  <span className="plc-line">{r.blurb}</span>
                  <span className="plc-foot">
                    <span className="plc-price">
                      <small>{r.category}</small>
                    </span>
                    <span className="plc-actions">
                      <button
                        type="button"
                        className={`plc-addtrip${inTripAlready ? ' is-in' : ''}`}
                        onClick={() =>
                          !inTripAlready &&
                          addItems([
                            {
                              kind: 'dining',
                              refId: r.id,
                              name: r.name,
                              detail: `${r.location} · ${r.cuisine}`,
                              price: 0,
                              image: r.image,
                            },
                          ])
                        }
                        disabled={inTripAlready}
                      >
                        {inTripAlready ? 'In my trip' : 'Add to trip'}
                      </button>
                    </span>
                  </span>
                </span>
              </article>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
