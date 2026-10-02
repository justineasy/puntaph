import { useMemo, useState } from 'react'
import { SectionHeading } from '../../components/system/SectionHeading'
import { Reveal } from '../../components/system/Reveal'
import { IconHeart, IconStar } from '../../components/system/Icons'
import { EXPERIENCES } from '../../data/platform'
import { useRegion } from '../../state/RegionContext'
import { useApp } from '../../state/AppContext'
import { useMyTrip } from '../../state/MyTripContext'
import '../platform.css'

const CATS = [
  'All',
  'Island Hopping',
  'Diving',
  'Surfing',
  'Sunset Cruise',
  'Private Boat',
  'Spa & Wellness',
  'Food Tour',
  'Hiking',
  'Photography',
  'Culture',
] as const

export default function ExperiencesPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>('All')
  const { isSaved, toggleSave } = useApp()
  const { addItems, inTrip } = useMyTrip()
  const { money } = useRegion()

  const list = useMemo(
    () => (cat === 'All' ? EXPERIENCES : EXPERIENCES.filter((x) => x.category === cat)),
    [cat],
  )

  return (
    <div className="pl shell">
      <header className="pl-hero">
        <SectionHeading
          level={1}
          eyebrow="Beyond the stay"
          title={
            <>
              Days worth
              <br />
              building around
            </>
          }
          dek="Boats, reefs, trails, tables, and rituals — booked alongside your stay, hosted by people who do this for a living."
        />
      </header>

      <div className="pl-cats" role="tablist" aria-label="Experience categories">
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
        {list.map((x, i) => {
          const saved = isSaved(x.id)
          const inTripAlready = inTrip(x.id)
          return (
            <Reveal key={x.id} delay={(i % 3) * 70}>
              <article className="plc">
                <span className="plc-media">
                  <img decoding="async" src={x.image} alt={x.title} loading="lazy" />
                  {x.rating >= 4.9 && (
                    <span className="tag tag--dark plc-flag">Highly rated</span>
                  )}
                  <button
                    type="button"
                    className={`heart plc-heart${saved ? ' is-saved' : ''}`}
                    aria-pressed={saved}
                    aria-label={saved ? `Remove ${x.title} from wishlist` : `Save ${x.title} to wishlist`}
                    onClick={() => toggleSave(x.id)}
                  >
                    <IconHeart filled={saved} />
                  </button>
                </span>
                <span className="plc-body">
                  <span className="plc-top">
                    <span className="plc-name">{x.title}</span>
                    <span className="rating plc-rating">
                      <IconStar /> {x.rating.toFixed(2)}
                      <span className="muted"> · {x.reviews}</span>
                    </span>
                  </span>
                  <span className="plc-loc">{x.location} · {x.category}</span>
                  <span className="plc-line">{x.description}</span>
                  <span className="plc-meta">{x.duration}</span>
                  <span className="plc-foot">
                    <span className="plc-price">
                      <span className="price">{money(x.price)}</span>
                      <small> / person</small>
                    </span>
                    <span className="plc-actions">
                      <button
                        type="button"
                        className={`plc-addtrip${inTripAlready ? ' is-in' : ''}`}
                        onClick={() =>
                          !inTripAlready &&
                          addItems([
                            {
                              kind: 'experience',
                              refId: x.id,
                              name: x.title,
                              detail: `${x.location} · ${x.duration}`,
                              price: x.price,
                              image: x.image,
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
