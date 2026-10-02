import { Link } from 'react-router-dom'
import { SectionHeading } from '../../components/system/SectionHeading'
import { IconClose } from '../../components/system/Icons'
import { useMyTrip } from '../../state/MyTripContext'
import { useRegion } from '../../state/RegionContext'
import { peso } from '../../lib/format'
import '../platform.css'

const KIND_LABEL: Record<string, string> = {
  stay: 'Stay',
  experience: 'Experience',
  dining: 'Dining',
  transport: 'Transport',
}

export default function MyTripPage() {
  const {
    items, days, tripName,
    removeItem, assignDay, setNote, setDays, setTripName, clearTrip,
  } = useMyTrip()
  const { money } = useRegion()

  const total = items.reduce((sum, i) => sum + i.price, 0)
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1)

  return (
    <div className="pl shell">
      <header className="pl-hero">
        <SectionHeading
          eyebrow="My trip"
          title={
            <>
              Build the days,
              <br />
              keep the notes
            </>
          }
          dek="Stays, experiences, tables, and rides in one timeline. Everything lives in this browser — a plan, not a payment."
        />
      </header>

      <div className="tripboard">
        <div className="tripboard-head">
          <input
            className="tripname"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            aria-label="Trip name"
            placeholder="Name this journey"
          />
          <div className="tripdays">
            <span className="field-label" style={{ marginBottom: 0 }}>Days</span>
            <button type="button" className="map-zoombtn" style={{ width: 32, height: 32, boxShadow: 'none' }} onClick={() => setDays(days - 1)} aria-label="Fewer days">−</button>
            <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{days}</span>
            <button type="button" className="map-zoombtn" style={{ width: 32, height: 32, boxShadow: 'none' }} onClick={() => setDays(days + 1)} aria-label="More days">+</button>
            {items.length > 0 && (
              <button type="button" className="btn btn--ghost" style={{ padding: '8px 16px', fontSize: 13, marginLeft: 10 }} onClick={clearTrip}>
                Clear trip
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="tripempty">
            <p className="h3">An empty itinerary is a kind of freedom.</p>
            <p className="muted">Add stays, experiences, tables, and rides — they land here as Day 1.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              <Link to="/explore" className="btn btn--primary">Browse stays</Link>
              <Link to="/experiences" className="btn btn--ghost">Experiences</Link>
              <Link to="/dining" className="btn btn--ghost">Dining</Link>
              <Link to="/transportation" className="btn btn--ghost">Transport</Link>
            </div>
          </div>
        ) : (
          <>
            {dayNumbers.map((day) => {
              const dayItems = items.filter((i) => i.day === day)
              return (
                <div key={day} className="daycol">
                  <div className="daycol-head">
                    <span className="daycol-num">Day {day}</span>
                    <span className="daycol-label">
                      {dayItems.length === 0 ? 'open' : `${dayItems.length} ${dayItems.length === 1 ? 'item' : 'items'}`}
                    </span>
                  </div>
                  {dayItems.map((item) => (
                    <div key={item.id} className="ti">
                      <span className="ti-img">
                        <img src={item.image} alt="" loading="lazy" />
                      </span>
                      <span>
                        <span className="ti-name">
                          {item.name}
                          <span className="ti-kind">{KIND_LABEL[item.kind]}</span>
                        </span>
                        <span className="ti-detail" style={{ display: 'block' }}>
                          {item.detail} {item.price > 0 && `· ${money(item.price)}`}
                        </span>
                        <input
                          className="ti-note"
                          value={item.note}
                          onChange={(e) => setNote(item.id, e.target.value)}
                          placeholder="Add a note — confirmation numbers, times, who's coming…"
                          aria-label={`Note for ${item.name}`}
                        />
                      </span>
                      <span className="ti-side">
                        <select
                          className="ti-select"
                          value={item.day}
                          onChange={(e) => assignDay(item.id, Number(e.target.value))}
                          aria-label={`Day for ${item.name}`}
                        >
                          {dayNumbers.map((n) => (
                            <option key={n} value={n}>Day {n}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="ti-remove"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from trip`}
                        >
                          <IconClose />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <span className="muted" style={{ fontSize: 13.5 }}>
                {items.length} {items.length === 1 ? 'item' : 'items'} · estimated total {money(total)} ({peso(total)})
              </span>
              <span className="muted" style={{ fontSize: 12.5 }}>
                Estimates only — book each piece from its own page.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
