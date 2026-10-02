import { Link } from 'react-router-dom'
import { Reveal } from '../components/system/Reveal'
import { IconArrowRight } from '../components/system/Icons'
import { editImage } from '../data/images'
import './host.css'

const PILLARS = [
  {
    title: 'List your property',
    text: 'Tell its story in your own words. Our editors help with photography and pricing.',
  },
  {
    title: 'Welcome guests',
    text: 'Message travelers before they arrive. Most hosts reply within the hour.',
  },
  {
    title: 'Manage stays',
    text: 'A calm calendar, clear house rules, and payouts on schedule, every time.',
  },
  {
    title: 'Track earnings',
    text: 'See revenue, occupancy, and what guests loved — in numbers that make sense.',
  },
]

export default function Host() {
  return (
    <div className="host">
      <section className="host-hero">
        <img className="host-hero-img" src={editImage('host-hero', 2000, 1200)} alt="" />
        <div className="host-hero-scrim" aria-hidden="true" />
        <div className="shell host-hero-content">
          <Reveal>
            <p className="eyebrow eyebrow--light">Punta for hosts</p>
          </Reveal>
          <Reveal delay={110}>
            <h1 className="display host-title">
              Your place could be someone’s next favorite memory.
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="host-sub">
              Share your space with travelers discovering the Philippines.
            </p>
          </Reveal>
          <Reveal delay={330}>
            <div className="host-ctas">
              <Link to="/host/list" className="btn btn--light btn--lg">
                Start hosting <IconArrowRight />
              </Link>
              <Link to="/host/dashboard" className="btn btn--ghost-light btn--lg">
                See the dashboard
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow eyebrow--dark">How it works</p></Reveal>
              <Reveal delay={80}><h2 className="h2">Four steps, no guesswork</h2></Reveal>
            </div>
          </div>
          <div className="host-pillars">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <article className="pillar">
                  <p className="pillar-num">0{i + 1}</p>
                  <h3 className="h3">{p.title}</h3>
                  <p className="pillar-text muted">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell host-quote">
          <Reveal>
            <blockquote className="h2">
              “The first guests arrived as strangers and left as friends. Six
              years later, half our bookings are returns.”
            </blockquote>
            <p className="quote-attr">Corazon A. — hosting since 2015, Batangas</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell host-final">
          <Reveal>
            <h2 className="h1">The house is ready. Are you?</h2>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/host/list" className="btn btn--light btn--lg">
              List your place <IconArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
