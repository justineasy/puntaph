import { Link, useParams } from 'react-router-dom'
import { SectionHeading } from '../../components/system/SectionHeading'
import { Reveal } from '../../components/system/Reveal'
import { IconArrowRight } from '../../components/system/Icons'
import { DESTINATIONS } from '../../data/destinations'
import { GUIDES } from '../../data/platform'
import { STAYS } from '../../data/properties'
import { EXPERIENCES, RESTAURANTS } from '../../data/platform'
import StayCard from '../../components/stays/StayCard'
import { poolImage } from '../../data/images'
import { useRegion } from '../../state/RegionContext'
import '../platform.css'

const EXTRA = ['bohol', 'batanes', 'siquijor', 'camiguin'] as const

const EXTRA_META: Record<string, { name: string; line: string; pool: string }> = {
  bohol: { name: 'Bohol', line: 'Chocolate hills and gentle seas.', pool: 'cebu' },
  batanes: { name: 'Batanes', line: 'Where the wind writes the landscape.', pool: 'terraces' },
  siquijor: { name: 'Siquijor', line: 'Mystic island, quiet coves.', pool: 'siargao' },
  camiguin: { name: 'Camiguin', line: 'Seven volcanoes, one small island.', pool: 'baguio' },
}

export function DestinationsPage() {
  const { t } = useRegion()
  return (
    <div className="pl shell">
      <header className="pl-hero">
        <Reveal>
          <p className="eyebrow eyebrow--dark">{t('dest.tab')}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="h1">
            {t('dest.title1')}
            <br />
            {t('dest.title2')}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="pl-hero-sub">{t('dest.dek')}</p>
        </Reveal>
      </header>

      <div className="pl-grid">
        {DESTINATIONS.map((d, i) => {
          const stayCount = STAYS.filter((s) => s.destination === d.id).length
          return (
          <Reveal key={d.id} delay={(i % 3) * 70}>
            <Link to={`/destinations/${d.id}`} className="plc" aria-label={`${d.name} guide`}>
              <span className="plc-media">
                <img decoding="async" src={poolImage(d.id, d.id)} alt={`${d.name} landscape`} loading="lazy" />
              </span>
              <span className="plc-body">
                <span className="plc-top">
                  <span className="plc-name">{d.name}</span>
                  <span className="plc-loc">{GUIDES[d.id]?.islandGroup}</span>
                </span>
                <span className="plc-line">{d.line}</span>
                <span className="plc-foot">
                  <span className="plc-price">
                    <span className="price">{stayCount}</span>{' '}
                    <small>stays</small>
                  </span>
                  <span className="plc-addtrip">
                    Open guide <IconArrowRight />
                  </span>
                </span>
              </span>
            </Link>
          </Reveal>
          )
        })}
        {EXTRA.map((id, i) => (
          <Reveal key={id} delay={(i % 3) * 70}>
            <div className="plc">
              <span className="plc-media">
                <img decoding="async" src={poolImage(EXTRA_META[id].pool, id)} alt={`${EXTRA_META[id].name} landscape`} loading="lazy" />
              </span>
              <span className="plc-body">
                <span className="plc-top">
                  <span className="plc-name">{EXTRA_META[id].name}</span>
                </span>
                <span className="plc-loc">Guide coming soon</span>
                <span className="plc-line">{EXTRA_META[id].line}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function DestinationDetailPage() {
  const { id } = useParams()
  const guide = id ? GUIDES[id as keyof typeof GUIDES] : undefined
  const dest = DESTINATIONS.find((d) => d.id === id)

  if (!guide || !dest) {
    return (
      <div className="pl shell">
        <p className="h1">Guide not found.</p>
        <Link to="/destinations" className="btn btn--primary" style={{ marginTop: 20 }}>
          All destinations
        </Link>
      </div>
    )
  }

  const stays = STAYS.filter((s) => s.destination === guide.id)
  const exps = EXPERIENCES.filter((x) => x.destination === guide.id)
  const diners = RESTAURANTS.filter((r) => r.destination === guide.id)

  return (
    <div className="pl shell">
      <div className="destcover">
        <img decoding="async" src={poolImage(guide.id, `${guide.id}-cover`)} alt={`${dest.name} landscape`} />
        <div className="destcover-scrim" />
        <div className="destcover-info">
          <p className="eyebrow eyebrow--light">{guide.islandGroup} · Philippines</p>
          <h1 className="h1">{dest.name}</h1>
          <p className="destcover-tag">{guide.tagline}</p>
        </div>
      </div>

      <p className="body-lg" style={{ maxWidth: '64ch' }}>{guide.description}</p>

      <dl className="facts">
        <div className="fact">
          <dt>Getting there</dt>
          <dd>{guide.gettingThere}</dd>
        </div>
        <div className="fact">
          <dt>Best time</dt>
          <dd>{guide.bestTime}</dd>
        </div>
        <div className="fact">
          <dt>Nearest airport</dt>
          <dd>{guide.airport}</dd>
        </div>
      </dl>

      {stays.length > 0 && (
        <section className="section section--tight" style={{ paddingBlock: '26px 0' }}>
          <SectionHeading
            eyebrow="Stay here"
            title={`Recommended stays`}
            dek={`${stays.length} visited properties in ${dest.name}.`}
            action={<Link to={`/explore?where=${encodeURIComponent(dest.name)}`} className="more">See all</Link>}
          />
          <div className="pl-grid">
            {stays.slice(0, 3).map((s) => (
              <StayCard key={s.id} stay={s} />
            ))}
          </div>
        </section>
      )}

      {exps.length > 0 && (
        <section className="section section--tight" style={{ paddingBlock: '40px 0' }}>
          <SectionHeading
            eyebrow="Do something"
            title={`Experiences in ${dest.name}`}
            action={<Link to="/experiences" className="more">All experiences</Link>}
          />
          <div className="pl-grid">
            {exps.map((x) => (
              <Reveal key={x.id}>
                <article className="plc">
                  <span className="plc-media">
                    <img decoding="async" src={x.image} alt={x.title} loading="lazy" />
                  </span>
                  <span className="plc-body">
                    <span className="plc-top">
                      <span className="plc-name">{x.title}</span>
                      <span className="rating plc-rating">★ {x.rating.toFixed(2)}</span>
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
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {diners.length > 0 && (
        <section className="section section--tight" style={{ paddingBlock: '40px 0' }}>
          <SectionHeading
            eyebrow="Eat well"
            title={`Where to eat`}
            action={<Link to="/dining" className="more">All dining</Link>}
          />
          <div className="pl-grid">
            {diners.map((r) => (
              <Reveal key={r.id}>
                <article className="plc">
                  <span className="plc-media">
                    <img decoding="async" src={r.image} alt={r.name} loading="lazy" />
                  </span>
                  <span className="plc-body">
                    <span className="plc-top">
                      <span className="plc-name">{r.name}</span>
                      <span className="rating plc-rating">★ {r.rating.toFixed(2)}</span>
                    </span>
                    <span className="plc-loc">{r.location}</span>
                    <span className="plc-line">{r.blurb}</span>
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
