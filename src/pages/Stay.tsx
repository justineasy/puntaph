import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BookingCard from '../components/stays/BookingCard'
import { useMyTrip } from '../state/MyTripContext'
import { GallerySkeleton, SkeletonGroup } from '../components/system/Skeletons'
import { IconCheck, IconHeart, IconPlus, IconStar } from '../components/system/Icons'
import { HOSTS } from '../data/hosts'
import { roomImage, roomLabel, ROOM_KEYS, srcSetFor } from '../data/images'
import { ratingBuckets, reviewsFor } from '../data/reviews'
import { getStay } from '../data/properties'
import { useApp } from '../state/AppContext'
import '../components/stays/staycard.css'
import './stay.css'

export default function Stay() {
  const { id } = useParams()
  const stay = getStay(id)
  const { isSaved, toggleSave } = useApp()
  const { addItems, inTrip } = useMyTrip()
  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState(false)

  if (!stay) {
    return (
      <div className="shell stay-missing">
        <p className="h1">This stay has drifted away.</p>
        <p className="muted">The link may be old, or the place no longer listed.</p>
        <Link to="/explore" className="btn btn--primary">Browse stays</Link>
      </div>
    )
  }

  // a data typo in `host:` must not blank the whole page — degrade gracefully
  const host =
    HOSTS[stay.host] ??
    ({ name: 'Your host', since: 2020, blurb: '', responseRate: '—' } as const)
  const reviews = reviewsFor(stay)
  const buckets = ratingBuckets(stay)
  const saved = isSaved(stay.id)

  return (
    <article className="stay">
      {/* ————— GALLERY ————— */}
      <div className="shell stay-head">
        <h1 className="h1">{stay.name}</h1>
        <div className="stay-sub">
          <span className="rating">
            <IconStar /> {stay.rating.toFixed(2)} <span className="muted">· {stay.reviews} reviews ·</span>
          </span>
          <span className="muted">{stay.location}</span>
        </div>
      </div>

      <div className="shell">
        {!loaded && (
          <SkeletonGroup label="Loading photos">
            <GallerySkeleton />
          </SkeletonGroup>
        )}
        <div className={`gallery${loaded ? ' is-loaded' : ''}`} style={loaded ? undefined : { display: 'none' }}>
          <figure className="gallery-main">
            <img decoding="async"
              src={roomImage(stay.id, ROOM_KEYS[active])}
              srcSet={srcSetFor(roomImage(stay.id, ROOM_KEYS[active]), [960, 1280, 1920])}
              sizes="(max-width: 900px) 100vw, 66vw"
              alt={roomLabel(ROOM_KEYS[active])}
              onLoad={() => setLoaded(true)}
            />
          </figure>
          <div className="gallery-side">
            {ROOM_KEYS.slice(1, 3).map((r) => (
              <figure key={r} className="gallery-thumb">
                <img
                  decoding="async"
                  src={roomImage(stay.id, r)}
                  srcSet={srcSetFor(roomImage(stay.id, r))}
                  sizes="(max-width: 900px) 50vw, 33vw"
                  alt={roomLabel(r)}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
        <div className="gallery-strip" role="tablist" aria-label="Photos">
          {ROOM_KEYS.map((r, i) => (
            <button
              key={r}
              role="tab"
              aria-selected={active === i}
              className={`gallery-dot${active === i ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {roomLabel(r)}
            </button>
          ))}
        </div>
      </div>

      {/* ————— BODY ————— */}
      <div className="shell stay-grid">
        <div className="stay-main">
          <section className="stay-block">
            <div className="stay-owner">
              <div>
                <p className="h2">
                  Entire {stay.type.toLowerCase()} in {stay.location.split(', ')[1] ?? stay.location}
                </p>
                <p className="muted stay-facts">
                  {stay.guests} guests · {stay.bedrooms} bedrooms · {stay.beds} beds · {stay.baths} bathrooms
                </p>
              </div>
              <button
                type="button"
                className={`heart stay-heart${saved ? ' is-saved' : ''}`}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                onClick={() => toggleSave(stay.id)}
              >
                <IconHeart filled={saved} />
              </button>
            </div>

            <hr className="divider" />

            <p className="body-lg">{stay.about}</p>
          </section>

          <section className="stay-block">
            <h2 className="h3">Where you’ll sleep</h2>
            <div className="sleep-grid">
              {Array.from({ length: stay.bedrooms }, (_, i) => (
                <div key={i} className="sleep-card">
                  <img
                    decoding="async"
                    src={roomImage(stay.id, 'bedroom', i + 1)}
                    srcSet={srcSetFor(roomImage(stay.id, 'bedroom', i + 1))}
                    sizes="(max-width: 440px) 100vw, (max-width: 700px) 50vw, (max-width: 960px) 30vw, 25vw"
                    alt={`Bedroom ${i + 1}`}
                    loading="lazy"
                  />
                  <p className="sleep-name">Bedroom {i + 1}</p>
                  <p className="sleep-facts muted">
                    {i === 0 ? '1 king bed' : i === 1 ? '2 double beds' : '2 single beds'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="stay-block">
            <h2 className="h3">What this place offers</h2>
            <ul className="amenities">
              {stay.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          <section className="stay-block">
            <h2 className="h3">
              Reviewed by guests <span className="muted stay-avgrating">{stay.rating.toFixed(2)}</span>
            </h2>
            <div className="buckets">
              {buckets.map((b) => (
                <div key={b.label} className="bucket">
                  <span>{b.label}</span>
                  <span className="bucket-bar">
                    <span style={{ width: `${(b.score / 5) * 100}%` }} />
                  </span>
                  <span className="bucket-num">{b.score.toFixed(2)}</span>
                </div>
          ))}
            </div>
            <div className="review-grid">
              {reviews.map((r) => (
                <figure key={r.author + r.date} className="review">
                  <figcaption>
                    <strong>{r.author}</strong>
                    <span className="muted"> · {r.date} · {'★'.repeat(Math.round(r.rating))}</span>
                  </figcaption>
                  <blockquote>{r.text}</blockquote>
                </figure>
              ))}
            </div>
          </section>

          <section className="stay-block">
            <h2 className="h3">Where you’ll be</h2>
            <p className="muted">
              Exact address is shared after booking. The area: {stay.location} —
              quiet streets, walkable to the water, tricycles easy to find.
            </p>
            <div className="stay-map" aria-hidden="true">
              <span className="stay-map-pin" />
            </div>
          </section>

          <section className="stay-block">
            <h2 className="h3">Meet your host</h2>
            <div className="host-card">
              <span className="host-avatar" aria-hidden="true">{host.name[0]}</span>
              <div>
                <p className="host-name">{host.name}</p>
                <p className="muted">Hosting since {host.since} · Responds {host.responseRate} of the time</p>
                <p className="host-blurb">{host.blurb}</p>
              </div>
            </div>
          </section>

          <section className="stay-block">
            <h2 className="h3">Things to know</h2>
            <div className="rules-grid">
              <div>
                <p className="drawer-title">House rules</p>
                <p className="muted">Check in after 2:00 pm · Check out before 12:00 noon · No smoking indoors · Parties by arrangement</p>
              </div>
              <div>
                <p className="drawer-title">Cancellation</p>
                <p className="muted">Free cancellation up to 5 days before check-in. After that, the first night is non-refundable.</p>
              </div>
              <div>
                <p className="drawer-title">Safety</p>
                <p className="muted">Smoke alarm · First-aid kit · Fire exit briefed at check-in · Emergency numbers on the fridge</p>
              </div>
            </div>
          </section>
        </div>

        <div className="stay-side">
          <BookingCard stay={stay} />
          {stay && (
            <button
              type="button"
              className={`trip-add${inTrip(stay.id) ? ' is-in' : ''}`}
              onClick={() =>
                !inTrip(stay.id) &&
                addItems([
                  {
                    kind: 'stay',
                    refId: stay.id,
                    name: stay.name,
                    detail: `${stay.location} · ${stay.bedrooms} bedrooms`,
                    price: stay.price,
                    image: stay.images[0],
                  },
                ])
              }
              disabled={inTrip(stay.id)}
            >
              {inTrip(stay.id) ? <IconCheck /> : <IconPlus />}
              {inTrip(stay.id) ? 'In my trip' : 'Add to my trip'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
