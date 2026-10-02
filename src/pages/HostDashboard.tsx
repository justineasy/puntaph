import { Link } from 'react-router-dom'
import { STAYS } from '../data/properties'
import { IconArrowRight } from '../components/system/Icons'
import './hostdashboard.css'

const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
const REVENUE = [46, 58, 71, 66, 82, 95, 99, 88, 79, 84, 91, 97] // in ₱10k

function RevenueChart() {
  const w = 640
  const h = 200
  const max = 110
  const step = w / (REVENUE.length - 1)
  const points = REVENUE.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
  const line = `M${points.join(' L')}`
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="rev-chart" role="img" aria-label="Monthly revenue trend, rising over twelve months">
      <path d={area} fill="rgba(62, 79, 60, 0.08)" />
      <path d={line} className="rev-line" fill="none" stroke="var(--forest)" strokeWidth="1.8" />
      {REVENUE.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - (v / max) * h} r="2.4" fill="var(--forest)" />
      ))}
    </svg>
  )
}

export default function HostDashboard() {
  const myStays = STAYS.filter((s) => s.host === 'amihan' || s.host === 'santos')
  const reservations = [
    { guest: 'Mika R.', stay: myStays[0], in: 'Jun 18', out: 'Jun 20', nights: 2, status: 'Confirmed' },
    { guest: 'Paolo S.', stay: myStays[1], in: 'Jul 02', out: 'Jul 05', nights: 3, status: 'Confirmed' },
    { guest: 'Dara L.', stay: myStays[2] ?? myStays[0], in: 'Jul 11', out: 'Jul 13', nights: 2, status: 'Awaiting reply' },
  ]

  return (
    <div className="hd">
      <div className="shell">
        <header className="hd-head">
          <div>
            <p className="eyebrow eyebrow--dark">Host tools</p>
            <h1 className="h1">Amihan’s dashboard</h1>
          </div>
          <Link to="/host/list" className="btn btn--primary">
            Add a property <IconArrowRight />
          </Link>
        </header>

        <div className="hd-metrics">
          <div className="hd-metric">
            <p className="hd-num">₱184,600</p>
            <p className="muted">Revenue · last 30 days</p>
          </div>
          <div className="hd-metric">
            <p className="hd-num">72%</p>
            <p className="muted">Occupancy</p>
          </div>
          <div className="hd-metric">
            <p className="hd-num">18</p>
            <p className="muted">Reservations</p>
          </div>
          <div className="hd-metric">
            <p className="hd-num">4.87</p>
            <p className="muted">Rating</p>
          </div>
          <div className="hd-metric">
            <p className="hd-num">2,341</p>
            <p className="muted">Profile views</p>
          </div>
        </div>

        <div className="hd-grid">
          <section className="hd-panel hd-panel--wide">
            <h2 className="h3">Revenue</h2>
            <p className="muted hd-sub">Twelve months, trending upward.</p>
            <RevenueChart />
            <div className="hd-months">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </section>

          <section className="hd-panel">
            <h2 className="h3">Messages</h2>
            <p className="muted hd-sub">Guests are waiting on two replies.</p>
            <div className="hd-msgs">
              <div className="hd-msg">
                <span className="hd-msg-ava" style={{ background: 'var(--sand)' }}>M</span>
                <div>
                  <p className="hd-msg-name">Mika R.</p>
                  <p className="muted hd-msg-text">Is early check-in possible on the 18th?</p>
                </div>
              </div>
              <div className="hd-msg">
                <span className="hd-msg-ava" style={{ background: 'var(--ivory-warm)' }}>P</span>
                <div>
                  <p className="hd-msg-name">Paolo S.</p>
                  <p className="muted hd-msg-text">Thank you! One last question about parking…</p>
                </div>
              </div>
            </div>
          </section>

          <section className="hd-panel hd-panel--wide">
            <h2 className="h3">Upcoming reservations</h2>
            <div className="hd-tablewrap">
            <table className="hd-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Property</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.guest}>
                    <td>{r.guest}</td>
                    <td className="muted">{r.stay?.name}</td>
                    <td className="muted">{r.in} – {r.out}</td>
                    <td>
                      <span className={`hd-status${r.status === 'Awaiting reply' ? ' is-pending' : ''}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>

          <section className="hd-panel">
            <h2 className="h3">Calendar</h2>
            <p className="muted hd-sub">Next three weekends</p>
            <div className="hd-cal">
              {['W1', 'W2', 'W3'].map((w) => (
                <div key={w} className="hd-week">
                  <span>{w}</span>
                  <span className="hd-week-bar">
                    <span style={{ width: w === 'W1' ? '88%' : w === 'W2' ? '45%' : '70%' }} />
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
