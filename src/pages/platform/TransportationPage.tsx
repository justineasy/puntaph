import { useMemo, useState } from 'react'
import { SectionHeading } from '../../components/system/SectionHeading'
import { Reveal } from '../../components/system/Reveal'
import { TRANSPORTS } from '../../data/platform'
import { useRegion } from '../../state/RegionContext'
import { useMyTrip } from '../../state/MyTripContext'
import '../platform.css'

const KINDS = [
  'All',
  'Airport Transfer',
  'Private Car',
  'Car Rental',
  'Shuttle',
  'Boat Transfer',
] as const

export default function TransportationPage() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>('All')
  const { addItems, inTrip } = useMyTrip()
  const { money } = useRegion()

  const list = useMemo(
    () => (kind === 'All' ? TRANSPORTS : TRANSPORTS.filter((t) => t.kind === kind)),
    [kind],
  )

  return (
    <div className="pl shell">
      <header className="pl-hero">
        <SectionHeading
          eyebrow="Getting around"
          title={
            <>
              The journey,
              <br />
              handled
            </>
          }
          dek="Drivers who wait, boats that leave on time, and scooters delivered to your door — arranged before you land."
        />
      </header>

      <div className="pl-cats" role="tablist" aria-label="Transportation types">
        {KINDS.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={kind === k}
            className={`chip${kind === k ? ' is-active' : ''}`}
            onClick={() => setKind(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="pl-grid">
        {list.map((t, i) => {
          const inTripAlready = inTrip(t.id)
          return (
            <Reveal key={t.id} delay={(i % 3) * 70}>
              <article className="plc">
                <span className="plc-media">
                  <img decoding="async" src={t.image} alt={t.name} loading="lazy" />
                  <span className="tag tag--dark plc-flag">{t.kind}</span>
                </span>
                <span className="plc-body">
                  <span className="plc-top">
                    <span className="plc-name">{t.name}</span>
                  </span>
                  <span className="plc-loc">{t.location}</span>
                  <span className="plc-line">{t.blurb}</span>
                  <span className="plc-meta">
                    {t.vehicle} · {t.capacity} · {t.availability}
                  </span>
                  <span className="plc-foot">
                    <span className="plc-price">
                      <span className="price">{money(t.price)}</span>
                      <small> / trip</small>
                    </span>
                    <span className="plc-actions">
                      <button
                        type="button"
                        className={`plc-addtrip${inTripAlready ? ' is-in' : ''}`}
                        onClick={() =>
                          !inTripAlready &&
                          addItems([
                            {
                              kind: 'transport',
                              refId: t.id,
                              name: t.name,
                              detail: `${t.location} · ${t.vehicle}`,
                              price: t.price,
                              image: t.image,
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
