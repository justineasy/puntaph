import { Link, useParams } from 'react-router-dom'
import StayCard from '../components/stays/StayCard'
import { Reveal } from '../components/system/Reveal'
import { IconArrowRight } from '../components/system/Icons'
import { getStory, nextStory, readingTime } from '../data/stories'
import { getStay } from '../data/properties'
import { editImage } from '../data/images'
import './story.css'

export default function Story() {
  const { key } = useParams()
  const story = getStory(key)

  if (!story) {
    return (
      <div className="shell story-missing">
        <p className="h1">That story hasn’t been written yet.</p>
        <p className="muted">The link may be old — the Edit keeps three for now.</p>
        <Link to="/" className="btn btn--primary">Back to the Edit</Link>
      </div>
    )
  }

  const next = nextStory(story.key)
  const minutes = readingTime(story)

  return (
    <article className="story">
      {/* ————— HERO ————— */}
      <header className="story-hero">
        <img className="story-hero-img" src={editImage(story.key)} alt="" />
        <div className="story-hero-scrim" aria-hidden="true" />
        <div className="shell story-hero-content">
          <Reveal>
            <p className="eyebrow eyebrow--light">The Punta Edit · {story.place}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display story-title">{story.title}</h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="story-standfirst">{story.standfirst}</p>
          </Reveal>
          <Reveal delay={280}>
            <p className="story-byline">
              {story.byline} · {minutes} min read
            </p>
          </Reveal>
        </div>
      </header>

      {/* ————— BODY ————— */}
      <div className="shell story-body">
        {story.sections.map((sec, i) => (
          <Reveal key={sec.heading} delay={i === 0 ? 0 : 60}>
            <section className="story-section">
              <h2 className="h2 story-section-head">{sec.heading}</h2>
              {sec.body.map((para, j) => (
                <p key={j} className={`story-para${i === 0 && j === 0 ? ' has-dropcap' : ''}`}>
                  {para}
                </p>
              ))}

              {/* pull quote rides after the second section */}
              {i === 1 && (
                <aside className="story-pullquote">
                  <p className="serif">{story.pullQuote}</p>
                </aside>
              )}
            </section>
          </Reveal>
        ))}

        {/* ————— FIELD NOTES ————— */}
        <Reveal>
          <aside className="story-notes" aria-label="Field notes">
            <p className="eyebrow eyebrow--dark">Field notes</p>
            <dl className="story-notes-grid">
              {story.fieldNotes.map((n) => (
                <div key={n.label} className="story-note">
                  <dt>{n.label}</dt>
                  <dd>{n.note}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </Reveal>

        {/* ————— WHERE TO SLEEP ————— */}
        <Reveal>
          <section className="story-stays">
            <div className="section-head">
              <div>
                <p className="eyebrow eyebrow--dark">From this story</p>
                <h2 className="h2">Where to sleep</h2>
              </div>
              <Link to="/explore" className="more">All stays</Link>
            </div>
            <div className="story-stays-grid">
              {story.stayIds.map((id) => {
                const s = getStay(id)
                return s ? <StayCard key={id} stay={s} /> : null
              })}
            </div>
          </section>
        </Reveal>
      </div>

      {/* ————— NEXT STORY ————— */}
      <Reveal>
        <Link to={`/story/${next.key}`} className="story-next">
          <div className="shell story-next-inner">
            <p className="eyebrow eyebrow--light">Next story</p>
            <p className="h1 story-next-title">
              {next.title}
              <IconArrowRight className="story-next-arrow" />
            </p>
            <p className="story-next-place">{next.place}</p>
          </div>
          <img className="story-next-img" src={editImage(next.key)} alt="" />
          <div className="story-next-scrim" aria-hidden="true" />
        </Link>
      </Reveal>
    </article>
  )
}
