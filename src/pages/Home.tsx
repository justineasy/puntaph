import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import SearchBar from '../components/search/SearchBar'
import DestinationCard from '../components/stays/DestinationCard'
import StayCard, { RAIL_SIZES } from '../components/stays/StayCard'
import { Reveal } from '../components/system/Reveal'
import { CountUp } from '../components/system/CountUp'
import { IconArrowRight } from '../components/system/Icons'
import { DESTINATIONS } from '../data/destinations'
import { OWNER_SPOTLIGHTS } from '../data/hosts'
import { editImage, heroImage, srcSetFor } from '../data/images'
import { featured, STAYS } from '../data/properties'
import './home.css'

const EDITS = [
  {
    key: 'batangas-water',
    title: 'A weekend by the water',
    place: 'Batangas',
    dek: 'Two nights, one long shoreline, and the best lomi in San Juan. Our editors map the perfect 48 hours south of Manila.',
  },
  {
    key: 'baguio-morning',
    title: 'A slower kind of morning',
    place: 'Baguio',
    dek: 'Frost on pine needles, kapeng barako at seven, and the city still asleep below. Where to wake up when you need to reset.',
  },
  {
    key: 'siargao-island',
    title: 'Island time',
    place: 'Siargao',
    dek: 'The island runs on tide charts and tricycle schedules. Here is how to spend a week when the schedule is the tide.',
  },
]

const SPOTLIGHT_MS = 3000

export default function Home() {
  const editorial = featured(8)
  const coastal = [...STAYS].sort((a, b) => a.price - b.price).slice(0, 8)

  // ————— rotating owner spotlight —————
  const [spotIndex, setSpotIndex] = useState(0)
  const [spotPaused, setSpotPaused] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  // ————— hero parallax — the photograph drifts down as you scroll away —————
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const el = mediaRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(() => {
        // 0.22 × scroll, capped to a fraction of the viewport — the shift
        // can never outrun the image's 130% crop and expose an edge
        const shift = Math.min(window.scrollY * 0.22, window.innerHeight * 0.24)
        el.style.transform = `translate3d(0, ${shift}px, 0)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reducedMotion])

  useEffect(() => {
    // pause on hover/focus; reduced-motion users get a still quote, not a carousel
    if (spotPaused || reducedMotion) return
    const t = window.setInterval(
      () => setSpotIndex((i) => (i + 1) % OWNER_SPOTLIGHTS.length),
      SPOTLIGHT_MS,
    )
    return () => window.clearInterval(t)
  }, [spotPaused, reducedMotion])

  return (
    <>
      {/* ————— HERO ————— */}
      <section className="hero">
        <div className="hero-media hero-parallax" ref={mediaRef} aria-hidden="true">
          <img
            className="hero-img"
            src={heroImage(2400, 1500)}
            srcSet={srcSetFor(heroImage(2400, 1500), [960, 1280, 1920])}
            sizes="100vw"
            alt=""
            decoding="async"
          />
        </div>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-content shell">
          <Reveal>
            <p className="eyebrow eyebrow--light hero-eyebrow">Punta / Philippines</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display hero-title" aria-label="Where will you stay?">
              <span className="w" aria-hidden="true">Where</span>{' '}
              <span className="w" aria-hidden="true">will</span>{' '}
              <span className="w" aria-hidden="true">you</span>{' '}
              <span className="w" aria-hidden="true">stay?</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="hero-sub">Beautiful places. Meaningful escapes.</p>
          </Reveal>
          <Reveal delay={380} className="hero-search">
            <SearchBar />
          </Reveal>
        </div>
        <div className="hero-fade" aria-hidden="true" />
        <span className="hero-scrollhint" aria-hidden="true" />
      </section>

      {/* ————— DESTINATION RIBBON ————— */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy}>
              {DESTINATIONS.map((d) => (
                <span className="marquee-item" key={`${copy}-${d.id}`}>
                  {d.name}
                  <span className="marquee-dot">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ————— INTRO STATEMENT ————— */}
      <section className="section intro">
        <div className="shell">
          <Reveal>
            <p className="eyebrow eyebrow--dark">The idea</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="h1 intro-statement">
              PUNTA is a collection of houses, villas, and quiet rooms across the
              Philippine islands — each one visited by our team, each one worth
              the journey.
            </p>
          </Reveal>
          <Reveal delay={200} className="intro-stats">
            <div className="intro-stat">
              <CountUp className="intro-stat-num" to={7641} />
              <span className="intro-stat-label">Islands in the archipelago</span>
            </div>
            <div className="intro-stat">
              <CountUp className="intro-stat-num" to={DESTINATIONS.length} />
              <span className="intro-stat-label">Regions curated</span>
            </div>
            <div className="intro-stat">
              <CountUp className="intro-stat-num" to={STAYS.length} />
              <span className="intro-stat-label">Stays visited &amp; verified</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— GO SOMEWHERE DIFFERENT ————— */}
      <section className="section section--tight">
        <div className="shell">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow eyebrow--dark">Destinations</p></Reveal>
              <Reveal delay={80}><h2 className="h2">Go somewhere <em className="accent">different</em></h2></Reveal>
            </div>
            <Link to="/explore" className="more">All destinations</Link>
          </div>
          <div className="dest-grid">
            <div className="dest-grid-a">
              {DESTINATIONS.slice(0, 2).map((d, i) => (
                <DestinationCard key={d.id} dest={d} size="lg" delay={i * 90} />
              ))}
            </div>
            <div className="dest-grid-b">
              {DESTINATIONS.slice(2, 6).map((d, i) => (
                <DestinationCard
                  key={d.id}
                  dest={d}
                  delay={i * 70}
                  /* grid-b is 4-col >1000px (≈23vw) and 2-col below (≈45vw) —
                     never 1-col, so the md preset's 92vw branch would tell the
                     browser to fetch a 960/1280px file for a ~170px slot.
                     These exprs mirror .shell (min(1440px,100%) + gutter) and
                     the grid gap exactly. */
                  sizes="(max-width: 1000px) calc(45vw - 9px), calc((min(100vw, 1440px) - clamp(40px, 10vw, 128px) - 54px) / 4)"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————— STAYS WORTH THE JOURNEY ————— */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow eyebrow--dark">Handpicked</p></Reveal>
              <Reveal delay={80}><h2 className="h2">Stays worth the <em className="accent">journey</em></h2></Reveal>
            </div>
            <Link to="/explore" className="more">Browse all stays</Link>
          </div>
        </div>
        <div className="rail-wrap">
          <div className="rail">
            {editorial.map((s) => (
              <div className="rail-item" key={s.id}>
                <StayCard stay={s} sizes={RAIL_SIZES} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— THE PUNTA EDIT ————— */}
      <section className="section section--dark edit">
        <div className="shell">
          <div className="edit-head">
            <Reveal>
              <p className="eyebrow eyebrow--light">Stories</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="h1">The Punta Edit</h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="edit-sub">Places we’d pack a bag for.</p>
            </Reveal>
          </div>

          <div className="edit-grid">
            {EDITS.map((e, i) => (
              <Reveal key={e.key} delay={i * 110}>
                <article className="edit-story">
                  <Link to={`/story/${e.key}`} className="edit-media zoom-target">
                    <span className="card-media zoom-host">
                      <img
                        decoding="async"
                        src={editImage(e.key)}
                        srcSet={srcSetFor(editImage(e.key))}
                        sizes="(max-width: 860px) 92vw, 31vw"
                        alt={e.title}
                        loading="lazy"
                      />
                    </span>
                  </Link>
                  <p className="edit-place">{e.place}</p>
                  <h3 className="h3">{e.title}</h3>
                  <p className="edit-dek">{e.dek}</p>
                  <Link to={`/story/${e.key}`} className="edit-more">
                    Read the story <IconArrowRight />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— GENTLE ON THE WALLET ————— */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow eyebrow--dark">Under ₱6,000</p></Reveal>
              <Reveal delay={80}><h2 className="h2">Small houses, <em className="accent">big weekends</em></h2></Reveal>
            </div>
            <Link to="/explore" className="more">See more</Link>
          </div>
        </div>
        <div className="rail-wrap">
          <div className="rail">
            {coastal.map((s) => (
              <div className="rail-item" key={s.id}>
                <StayCard stay={s} sizes={RAIL_SIZES} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— HOST BANNER ————— */}
      <section className="section section--tight">
        <div className="shell">
          <Reveal variant="img">
            <div className="host-banner">
              <img
                decoding="async"
                src={editImage('host-banner')}
                srcSet={srcSetFor(editImage('host-banner'), [960, 1280, 1920])}
                sizes="92vw"
                alt=""
                loading="lazy"
              />
              <div className="host-banner-scrim" aria-hidden="true" />
              <div className="host-banner-content">
                <p className="eyebrow eyebrow--light">Punta for hosts</p>
                <h2 className="h1">Your place could be someone’s next favorite memory.</h2>
                <Link to="/host" className="btn btn--light">
                  Start hosting <IconArrowRight />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— OWNER SPOTLIGHT — rotates through the hosts ————— */}
      <section className="section section--tight quote">
        <div className="shell">
          <Reveal>
            <p className="quote-mark" aria-hidden="true">”</p>
            <div className="spot-stage">
              {OWNER_SPOTLIGHTS.map((s, i) => (
                <div
                  key={s.name}
                  className={`spot-slide${i === spotIndex ? ' is-live' : ''}`}
                  aria-hidden={i !== spotIndex}
                >
                  <blockquote className="h2 quote-text">{s.quote}</blockquote>
                  <Link
                    to={`/stay/${s.stayId}`}
                    className="owner-spot"
                    tabIndex={i === spotIndex ? 0 : -1}
                    aria-label={`Visit ${s.property} — stay hosted by ${s.name}`}
                    // pause only while the visitor is on the card itself —
                    // a stray cursor elsewhere must never freeze the rotation
                    onMouseEnter={() => setSpotPaused(true)}
                    onMouseLeave={() => setSpotPaused(false)}
                    onFocus={() => setSpotPaused(true)}
                    onBlur={() => setSpotPaused(false)}
                  >
                    <span className="owner-avatar" aria-hidden="true">
                      {s.name.trim()[0]}
                      {s.name.split(' ')[1]?.trim()[0]}
                    </span>
                    <span className="owner-meta">
                      <span className="owner-name">{s.name}</span>
                      <span className="owner-sub">
                        {s.role} · {s.property} · {s.place}
                      </span>
                    </span>
                    <span className="owner-go">Visit stay</span>
                  </Link>
                </div>
              ))}
            </div>
            <div className="spot-dots" role="group" aria-label="Choose an owner">
              {OWNER_SPOTLIGHTS.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  className={`spot-dot${i === spotIndex ? ' is-live' : ''}`}
                  aria-label={`Show ${s.name}, ${s.property}`}
                  aria-pressed={i === spotIndex}
                  onClick={() => setSpotIndex(i)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
