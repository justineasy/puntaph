import { useState } from 'react'
import { Link } from 'react-router-dom'
import StayCard from '../components/stays/StayCard'
import '../components/stays/staycard.css'
import { IconArrowRight, IconHeart, IconStar } from '../components/system/Icons'
import { getStay } from '../data/properties'
import { EXPERIENCES, RESTAURANTS } from '../data/platform'
import { useApp } from '../state/AppContext'
import './wishlist.css'
import './platform.css'

const FILTERS = ['All', 'Beach', 'Mountain', 'Luxury', 'Weekend'] as const
const TABS = ['Stays', 'Experiences', 'Dining'] as const

export default function Wishlist() {
  const { wishlist } = useApp()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [tab, setTab] = useState<(typeof TABS)[number]>('Stays')

  const saved = wishlist
    .map((id) => getStay(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .filter((s) => filter === 'All' || s.category === filter)

  const savedExperiences = EXPERIENCES.filter((x) => wishlist.includes(x.id))
  const savedRestaurants = RESTAURANTS.filter((r) => wishlist.includes(r.id))
  const platformCount = savedExperiences.length + savedRestaurants.length

  return (
    <div className="wishlist shell">
      <header className="page-head">
        <p className="eyebrow eyebrow--dark">Saved for later</p>
        <h1 className="h1">Wishlist</h1>
        <p className="muted wl-sub">A collection, not a cart.</p>
      </header>

      <div className="wl-tabs" role="tablist" aria-label="Wishlist collections">
        {TABS.map((t) => {
          const count =
            t === 'Stays'
              ? saved.length
              : t === 'Experiences'
                ? savedExperiences.length
                : savedRestaurants.length
          return (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`chip${tab === t ? ' is-active' : ''}`}
              onClick={() => setTab(t)}
            >
              <IconHeart filled={tab === t} /> {t}
              {count > 0 && <span className="filter-count">{count}</span>}
            </button>
          )
        })}
        {platformCount === 0 && tab !== 'Stays' && (
          <span className="muted" style={{ fontSize: 13, alignSelf: 'center' }}>
            Heart experiences and restaurants to collect them here.
          </span>
        )}
      </div>

      {tab === 'Stays' && (
        <>
          <div className="wl-filters" role="tablist" aria-label="Wishlist filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={`chip${filter === f ? ' is-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {saved.length === 0 ? (
            <div className="wl-empty">
              <p className="h2">
                {filter === 'All' ? 'Nothing saved yet.' : `No ${filter.toLowerCase()} stays saved.`}
              </p>
              <p className="muted">Tap the heart on any stay to begin a collection.</p>
              <Link to="/explore" className="btn btn--primary">
                Explore stays <IconArrowRight />
              </Link>
            </div>
          ) : (
            <div className="wl-grid">
              {saved.map((s) => (
                <StayCard key={s.id} stay={s} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'Experiences' && (
        <div className="pl-grid" style={{ marginTop: 0 }}>
          {savedExperiences.map((x) => (
            <article key={x.id} className="plc">
              <span className="plc-media">
                <img src={x.image} alt={x.title} loading="lazy" />
              </span>
              <span className="plc-body">
                <span className="plc-top">
                  <span className="plc-name">{x.title}</span>
                  <span className="rating plc-rating">
                    <IconStar /> {x.rating.toFixed(2)}
                  </span>
                </span>
                <span className="plc-loc">{x.location}</span>
                <span className="plc-meta">{x.duration}</span>
                <span className="plc-foot">
                  <span className="plc-price">
                    <span className="price">₱{x.price.toLocaleString()}</span>
                    <small> / person</small>
                  </span>
                  <Link to="/experiences" className="plc-addtrip">Details</Link>
                </span>
              </span>
            </article>
          ))}
        </div>
      )}

      {tab === 'Dining' && (
        <div className="pl-grid" style={{ marginTop: 0 }}>
          {savedRestaurants.map((r) => (
            <article key={r.id} className="plc">
              <span className="plc-media">
                <img src={r.image} alt={r.name} loading="lazy" />
              </span>
              <span className="plc-body">
                <span className="plc-top">
                  <span className="plc-name">{r.name}</span>
                  <span className="rating plc-rating">
                    <IconStar /> {r.rating.toFixed(2)}
                  </span>
                </span>
                <span className="plc-loc">{r.location} · {r.cuisine}</span>
                <span className="plc-line">{r.blurb}</span>
                <span className="plc-foot">
                  <small>{r.category}</small>
                  <Link to="/dining" className="plc-addtrip">Details</Link>
                </span>
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
