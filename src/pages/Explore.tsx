import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import OverlayCard from '../components/stays/OverlayCard'
import DestinationCard from '../components/stays/DestinationCard'
import StayIndex from '../components/stays/StayIndex'
import Carousel from '../components/stays/Carousel'
import {
  OverlayCardSkeleton,
  SkeletonGroup,
  StayIndexSkeleton,
} from '../components/system/Skeletons'
import { SectionHeading } from '../components/system/SectionHeading'
import { IconClose, IconFilter } from '../components/system/Icons'
import { Reveal } from '../components/system/Reveal'
import { DESTINATIONS } from '../data/destinations'
import { STAYS, priceBounds } from '../data/properties'
import { heroImage } from '../data/images'
import { peso } from '../lib/format'
import './explore.css'

const CATS = ['All', 'Beach', 'Mountain', 'Luxury', 'Weekend'] as const
const SORTS = ['Recommended', 'Price: low to high', 'Price: high to low', 'Highest rated'] as const
const TYPES = ['Villa', 'House', 'Loft', 'Condo', 'Cabin', 'Cottage', 'Lodge', 'Guesthouse'] as const
const AMENITIES = ['Pool', 'Beachfront access', 'Wi-Fi', 'Air conditioning', 'Free parking', 'Fireplace', 'Full kitchen'] as const

export default function Explore() {
  const [params, setParams] = useSearchParams()

  const where = params.get('where') ?? ''
  // view = which tab you're in (stays index / destinations); it is stored
  // separately from cat so filtering never kicks you out of the tab
  const view = params.get('view') ?? ''
  const catRaw = params.get('cat') ?? 'All'
  const cat = (['Beach', 'Mountain', 'Luxury', 'Weekend'] as const).includes(catRaw as never)
    ? catRaw
    : 'All'
  const sort = params.get('sort') ?? 'Recommended'

  // legacy links (?cat=stays / ?cat=destinations) still land on the right tab
  const isStaysTab = view === 'stays' || catRaw === 'stays'
  const isDestinationsTab = view === 'destinations' || catRaw === 'destinations'

  const [maxPrice, setMaxPrice] = useState(25000)
  const [bedrooms, setBedrooms] = useState(0)
  const [types, setTypes] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [favOnly, setFavOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // brief branded skeleton on filter changes — never a blank flash
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 420)
    return () => window.clearTimeout(t)
  }, [where, cat, sort, maxPrice, bedrooms, types, amenities, favOnly, minRating])

  // base list = every filter EXCEPT the category chip — this is what the
  // chip counts are computed against, so numbers never lie
  const baseList = useMemo(() => {
    let list = [...STAYS]
    if (where) {
      const q = where.toLowerCase()
      list = list.filter(
        (s) =>
          s.destination.startsWith(q) ||
          s.location.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q),
      )
    }
    if (favOnly) list = list.filter((s) => s.guestFavorite)
    if (minRating > 0) list = list.filter((s) => s.rating >= minRating)
    if (bedrooms > 0) list = list.filter((s) => s.bedrooms >= bedrooms)
    if (types.length > 0) list = list.filter((s) => types.includes(s.type))
    if (amenities.length > 0)
      list = list.filter((s) => amenities.every((a) => s.amenities.some((x) => x.includes(a))))
    return list.filter((s) => s.price <= maxPrice)
  }, [where, maxPrice, bedrooms, types, amenities, favOnly, minRating])

  const results = useMemo(() => {
    const list =
      cat === 'All' ? [...baseList] : baseList.filter((s) => s.category === cat)
    switch (sort) {
      case 'Price: low to high':
        list.sort((a, b) => a.price - b.price)
        break
      case 'Price: high to low':
        list.sort((a, b) => b.price - a.price)
        break
      case 'Highest rated':
        list.sort((a, b) => b.rating - a.rating)
        break
    }
    return list
  }, [baseList, cat, sort])

  // live per-category counts (catalog behavior on the Stays tab)
  const catCounts = useMemo(() => {
    const m: Record<string, number> = { All: baseList.length }
    for (const s of baseList) m[s.category] = (m[s.category] ?? 0) + 1
    return m
  }, [baseList])

  const activeFilterCount =
    (maxPrice < 25000 ? 1 : 0) +
    (bedrooms > 0 ? 1 : 0) +
    types.length +
    amenities.length +
    (favOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0)

  // browsing = no query, no filters — the full editorial collection
  const browsing = !where && cat === 'All' && sort === 'Recommended' && activeFilterCount === 0

  // editorial composition: one featured, a four-card mosaic, a carousel
  const featuredStay = results[0]
  const mosaic = results.slice(1, 5)
  const rail = results.slice(5)

  // Escape closes the drawer; body scroll locks while it's open
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  function toggleIn(list: string[], set: (v: string[]) => void, v: string) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  }

  function clearAll() {
    setMaxPrice(25000)
    setBedrooms(0)
    setTypes([])
    setAmenities([])
    setFavOnly(false)
    setMinRating(0)
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div className="explore">
      {/* ————— STAYS TAB BAND ————— */}
      {isStaysTab && (
        <section className="staysband">
          <div className="shell">
            <Reveal>
              <p className="eyebrow eyebrow--dark">Punta · The index</p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display staysband-title">
                Every stay,
                <br />
                one list
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="staysband-sub">
                The complete Punta catalog — every property we keep, priced and
                rated. Sort it, filter it, work through it.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="staysband-count">
                {results.length} {results.length === 1 ? 'stay' : 'stays'}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <dl className="staysband-stats">
                <div>
                  <dt>{DESTINATIONS.length}</dt>
                  <dd>islands</dd>
                </div>
                <div>
                  <dt>{STAYS.length}</dt>
                  <dd>properties</dd>
                </div>
                <div>
                  <dt>{peso(priceBounds().min)}</dt>
                  <dd>from / night</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={280} className="staysband-search">
              <SearchBar
                key={where}
                variant="panel"
                initial={{
                  where,
                  guests: Number(params.get('g')) || 2,
                }
              }
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* ————— HERO (browse + destinations) ————— */}
      {!isStaysTab && (
      <section className="exhero">
        <div className="shell exhero-grid">
          <div className="exhero-copy">
            <Reveal>
              <p className="eyebrow eyebrow--dark">Punta · Philippines</p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display exhero-title">
                Explore
                <br />
                the world
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="exhero-sub">
                Handpicked stays in extraordinary places — from quiet coastal
                retreats to mountain escapes.
              </p>
            </Reveal>
          </div>
          <Reveal delay={140} variant="img" className="exhero-media">
            <img
              src={heroImage(1400, 1750)}
              alt="Morning light over a Philippine coastline"
            />
          </Reveal>
        </div>

        {/* floating search, overlapping the hero's bottom edge */}
        <div className="shell exhero-search">
          <Reveal delay={280}>
            <SearchBar
              key={where}
              variant="panel"
              initial={{
                where,
                guests: Number(params.get('g')) || 2,
              }}
            />
          </Reveal>
        </div>
      </section>
      )}

      {/* ————— CATEGORY BAR ————— */}
      <div className="explore-filterbar">
        <div className="shell explore-cats" role="tablist" aria-label="Categories">
          {CATS.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              className={`chip${cat === c ? ' is-active' : ''}`}
              onClick={() => setParam('cat', c === 'All' ? '' : c)}
            >
              {c}
              {isStaysTab && (
                <span className="chip-count">{catCounts[c] ?? 0}</span>
              )}
            </button>
          ))}
          <span className="explore-spacer" />
          {isStaysTab && (
            <label className={`filterbar-sort${sort !== 'Recommended' ? ' is-set' : ''}`}>
              <span className="field-label">Sort</span>
              <select
                className="idx-select"
                value={sort}
                onChange={(e) => setParam('sort', e.target.value === 'Recommended' ? '' : e.target.value)}
                aria-label="Sort stays"
              >
                {SORTS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          )}
          <button
            type="button"
            className="chip explore-filter-btn"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
          >
            <IconFilter /> Filters
            {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      {/* ————— COLLECTION ————— */}
      <div className="shell explore-body">
        {isDestinationsTab ? (
          <section className="section explore-picks">
            <SectionHeading
              eyebrow="The Philippines"
              title={
                <>
                  Eight destinations,
                  <br />
                  one archipelago
                </>
              }
              dek="Every stay on Punta sits within one of these eight places — each visited by our team."
              action={
                <Link to="/explore" className="more">
                  Browse all stays
                </Link>
              }
            />
            <div className="explore-dests">
              {DESTINATIONS.map((d, i) => (
                <DestinationCard key={d.id} dest={d} delay={i * 60} />
              ))}
            </div>
          </section>
        ) : isStaysTab ? (
          loading ? (
            <SkeletonGroup label="Loading stays">
              <StayIndexSkeleton />
            </SkeletonGroup>
          ) : (
            <StayIndex stays={results} />
          )
        ) : loading ? (
          <SkeletonGroup className="explore-skeletons" label="Loading stays">
            <div className="skel-featured">
              <OverlayCardSkeleton featured />
            </div>
            <div className="explore-grid explore-grid--rest">
              {Array.from({ length: 6 }, (_, i) => (
                <OverlayCardSkeleton key={i} phase={(i % 3) * 90 + i * 20} />
              ))}
            </div>
          </SkeletonGroup>
        ) : results.length === 0 ? (
          <div className="explore-empty">
            <p className="h3">Nothing here — yet.</p>
            <p className="muted">
              Try widening the price range or clearing a filter or two.
            </p>
            <button type="button" className="btn btn--ghost" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        ) : browsing ? (
          <section className="explore-collection">
            <SectionHeading
              eyebrow="The collection"
              title={
                <>
                  Stay somewhere
                  <br />
                  extraordinary
                </>
              }
              dek={`${results.length} stays across eight destinations — each one visited, each one worth the journey.`}
            />

            {/* featured */}
            {featuredStay && (
              <div className="explore-lead">
                <OverlayCard stay={featuredStay} featured eager />
              </div>
            )}

            {/* mosaic — LARGE / small small rhythm */}
            {mosaic.length > 0 && (
              <div className="explore-mosaic">
                {mosaic.map((s, i) => (
                  <div className={`mosaic-cell mosaic-cell--${i + 1}`} key={s.id}>
                    <OverlayCard stay={s} delay={i * 80} />
                  </div>
                ))}
              </div>
            )}

            {/* the rest — carousel */}
            {rail.length >= 3 && (
              <div className="explore-rail">
                <Carousel label="More stays">
                  {rail.map((s) => (
                    <li className="carousel-item" key={s.id}>
                      <OverlayCard stay={s} />
                    </li>
                  ))}
                </Carousel>
              </div>
            )}
          </section>
        ) : (
          <section>
            {where && (
              <p className="explore-where h2">
                {where}
                <span className="muted">
                  {' '}
                  — {results.length} {results.length === 1 ? 'stay' : 'stays'}
                </span>
              </p>
            )}
            {/* editorial lead even in filtered view — results keep a hierarchy */}
            {results[0] && (
              <div className="explore-lead">
                <OverlayCard stay={results[0]} featured eager />
              </div>
            )}
            {results.length > 1 && (
              <div className="explore-grid explore-grid--rest">
                {results.slice(1).map((s, i) => (
                  <OverlayCard key={s.id} stay={s} delay={(i % 3) * 70} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ————— TOP PICKS ————— */}
      {browsing && !isDestinationsTab && !isStaysTab && (
        <section className="section section--tight explore-picks">
          <div className="shell">
            <SectionHeading
              eyebrow="Popular destinations"
              title={
                <>
                  Top picks
                  <br />
                  this week
                </>
              }
              dek="Places worth rearranging your plans for."
              action={
                <Link to="/explore?cat=destinations" className="more">
                  All destinations
                </Link>
              }
            />
            <div className="explore-dests">
              {DESTINATIONS.slice(0, 6).map((d, i) => (
                <DestinationCard key={d.id} dest={d} delay={i * 60} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ————— FILTER DRAWER ————— */}
      {drawerOpen && (
        <div className="drawer-root" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="drawer-scrim"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="drawer">
            <header className="drawer-head">
              <h2 className="h3">Filters</h2>
              <button
                type="button"
                className="drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
              >
                <IconClose />
              </button>
            </header>

            <div className="drawer-body">
              <section>
                <p className="drawer-title">Price range</p>
                <p className="drawer-current">
                  Up to <strong>{peso(maxPrice)}</strong>
                  {maxPrice >= 25000 && ' (or more)'}
                </p>
                <input
                  type="range"
                  min={3000}
                  max={25000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Maximum price per night"
                />
              </section>

              <section>
                <p className="drawer-title">Property type</p>
                <div className="drawer-chips">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`chip${types.includes(t) ? ' is-active' : ''}`}
                      onClick={() => toggleIn(types, setTypes, t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="drawer-title">Bedrooms</p>
                <div className="drawer-chips">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`chip${bedrooms === n ? ' is-active' : ''}`}
                      onClick={() => setBedrooms(n)}
                    >
                      {n === 0 ? 'Any' : `${n}+`}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="drawer-title">Amenities</p>
                <div className="drawer-chips">
                  {AMENITIES.map((a) => (
                    <button
                      key={a}
                      className={`chip${amenities.includes(a) ? ' is-active' : ''}`}
                      onClick={() => toggleIn(amenities, setAmenities, a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="drawer-title">Rating</p>
                <div className="drawer-chips">
                  {[0, 4.5, 4.7, 4.8].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`chip${minRating === r ? ' is-active' : ''}`}
                      onClick={() => setMinRating(r)}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`chip${favOnly ? ' is-active' : ''}`}
                    onClick={() => setFavOnly(!favOnly)}
                  >
                    Guest favorite
                  </button>
                </div>
              </section>
            </div>

            <footer className="drawer-foot">
              <button type="button" className="btn btn--ghost" onClick={clearAll}>
                Clear all
              </button>
              <button type="button" className="btn btn--primary" onClick={() => setDrawerOpen(false)}>
                Show {results.length} {results.length === 1 ? 'stay' : 'stays'}
              </button>
            </footer>
          </aside>
        </div>
      )}
    </div>
  )
}
