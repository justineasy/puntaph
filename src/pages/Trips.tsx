import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight } from '../components/system/Icons'
import { getStay } from '../data/properties'
import { fmtDateRange, peso, todayISO } from '../lib/format'
import { useApp } from '../state/AppContext'
import './trips.css'

const TABS = ['Upcoming', 'Past', 'Cancelled'] as const

export default function Trips() {
  const { trips, cancelTrip } = useApp()
  const [tab, setTab] = useState<(typeof TABS)[number]>('Upcoming')
  // which trip is awaiting a cancel confirmation — inline, not a modal
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const today = todayISO()
  const list = trips.filter((t) =>
    tab === 'Upcoming'
      ? t.status === 'upcoming' && t.checkOut >= today
      : tab === 'Past'
        ? t.status === 'upcoming' && t.checkOut < today
        : t.status === 'cancelled',
  )

  return (
    <div className="trips shell">
      <header className="page-head">
        <p className="eyebrow eyebrow--dark">Your journeys</p>
        <h1 className="h1">My trips</h1>
      </header>

      <div className="trips-tabs" role="tablist" aria-label="Trip status">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`chip${tab === t ? ' is-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="trips-empty">
          {tab === 'Upcoming' && trips.length === 0 ? (
            <>
              <p className="trips-empty-kicker">Nothing here yet</p>
              <p className="h2">No journeys — yet.</p>
              <p className="muted">The first one is usually the hardest to book — after that it’s a habit.</p>
              <Link to="/explore" className="btn btn--primary">
                Find a stay <IconArrowRight />
              </Link>
            </>
          ) : (
            <p className="muted">Nothing under “{tab}”.</p>
          )}
        </div>
      ) : (
        <div className="trips-list">
          {list.map((t) => {
            const stay = getStay(t.stayId)
            if (!stay) return null
            const nights = Math.max(
              1,
              Math.round((Date.parse(t.checkOut) - Date.parse(t.checkIn)) / 86_400_000),
            )
            return (
              <article key={t.id} className={`trip-card${t.status === 'cancelled' ? ' is-cancelled' : ''}`}>
                <img decoding="async" loading="lazy" src={stay.images[0]} alt={stay.name} />
                <div className="trip-info">
                  <p className={`trip-status trip-status--${t.status}`}>{t.status}</p>
                  <h2 className="h3">{stay.name}</h2>
                  <p className="trip-where">{stay.location}</p>
                  <p className="trip-tagline">{stay.tagline}</p>
                  <div className="trip-foot">
                    <span className="trip-meta">
                      {fmtDateRange(t.checkIn, t.checkOut)} · {nights} {nights === 1 ? 'night' : 'nights'} · {t.guests}{' '}
                      {t.guests === 1 ? 'guest' : 'guests'}
                    </span>
                    <span className="trip-total">{peso(t.total)}</span>
                  </div>
                  {t.status === 'cancelled' ? (
                    <div className="trip-actions">
                      <Link to={`/checkout/${stay.id}`} className="trip-rebook">
                        Book again <IconArrowRight />
                      </Link>
                      <Link to={`/stay/${stay.id}`} className="trip-link">View stay</Link>
                    </div>
                  ) : confirmingId === t.id ? (
                    <div className="trip-confirm" role="alertdialog" aria-label="Confirm cancellation">
                      <span className="trip-confirm-q">Cancel this stay? The first night becomes non-refundable.</span>
                      <span className="trip-confirm-btns">
                        <button type="button" className="trip-link" onClick={() => setConfirmingId(null)}>
                          No, keep it
                        </button>
                        <button
                          type="button"
                          className="trip-link trip-cancel"
                          onClick={() => {
                            cancelTrip(t.id)
                            setConfirmingId(null)
                          }}
                        >
                          Yes, cancel it
                        </button>
                      </span>
                    </div>
                  ) : (
                    <div className="trip-actions">
                      <Link to={`/stay/${stay.id}`} className="trip-link">View stay</Link>
                      <Link to={`/stay/${stay.id}`} className="trip-link">Message host</Link>
                      <Link to={`/stay/${stay.id}`} className="trip-link">Directions</Link>
                      {t.status === 'upcoming' && (
                        <button type="button" className="trip-link trip-cancel" onClick={() => setConfirmingId(t.id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
