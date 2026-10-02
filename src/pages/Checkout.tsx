import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { IconCheck } from '../components/system/Icons'
import { getStay } from '../data/properties'
import { fmtDate, nights, todayISO, addDays } from '../lib/format'
import { quote } from '../lib/pricing'
import { useSession } from '../state/SessionContext'
import { useRegion } from '../state/RegionContext'
import { PaymentPartners } from '../components/system/PaymentPartners'
import { SignInControl } from '../components/entry/MemberBar'
import { DemoNotice } from '../components/system/DemoNotice'
import './checkout.css'

const PAYMENTS = ['GCash', 'Maya', 'Credit / Debit Card', 'Bank Transfer'] as const

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const stay = getStay(id)
  const { member, isMember, priceMultiplier } = useSession()
  const { money } = useRegion()
  const location = useLocation()

  // dates & guests arrive via the search link (?in=&out=&g=) — parsed once,
  // clamped so a hand-edited URL can never produce 0 guests
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  const [step, setStep] = useState(1)
  const [checkIn, setCheckIn] = useState(query.get('in') ?? addDays(todayISO(), 14))
  const [checkOut, setCheckOut] = useState(query.get('out') ?? addDays(todayISO(), 16))
  const [guests, setGuests] = useState(() => Math.max(1, Number(query.get('g')) || 2))

  // started from the account when there is one, so a signed-in visitor
  // gets their own details without retyping them
  const [name, setName] = useState(member?.name ?? '')
  const [email, setEmail] = useState(member?.email ?? '')
  const [phone, setPhone] = useState('')
  const [altPhone, setAltPhone] = useState('')
  const [method, setMethod] = useState<string>('GCash')
  const [processing, setProcessing] = useState(false)

  // signing in part-way through fills whatever they haven't typed yet — it
  // never overwrites a field they already own
  useEffect(() => {
    if (!member) return
    setName((n) => n || member.name)
    setEmail((e) => e || member.email)
  }, [member])

  if (!stay) {
    return (
      <div className="shell checkout-missing">
        <p className="h1">We couldn’t find that stay.</p>
        <Link to="/explore" className="btn btn--primary">Back to explore</Link>
      </div>
    )
  }

  const n = Math.max(1, nights(checkIn, checkOut))
  const q = quote(stay, priceMultiplier, n)
  const subtotal = q.subtotal
  const cleaning = q.cleaning
  const serviceFee = q.serviceFee
  const total = q.total

  const steps = ['Your dates', 'Your guests', 'Your information', 'Payment', 'Confirmation']

  const pay = () => {
    setProcessing(true)
    // simulate a payment — never a real charge
    window.setTimeout(() => {
      // Paying carries the booking to the confirmation page — it does NOT
      // save or book anything. The reservation is written there, once the
      // guest has checked the details we'd reach them at.
      navigate(`/confirmation/${stay.id}`, {
        state: {
          checkIn,
          checkOut,
          guests,
          total,
          method,
          contact: { name, email, phone },
        },
      })
    }, 1600)
  }

  const canContinue =
    step !== 3 || (name.trim().length > 1 && email.includes('@') && phone.trim().length > 6)

  return (
    <div className="checkout">
      <div className="shell">
        <header className="checkout-head">
          <Link to={`/stay/${stay.id}`} className="checkout-back">← {stay.name}</Link>
          <p className="checkout-wordmark">PUNTA</p>
        </header>

        {/* progress — completed steps are tappable to go back; future ones locked */}
        <ol className="steps" aria-label="Booking progress">
          {steps.map((label, i) => (
            <li
              key={label}
              className={`step${i + 1 < step ? ' is-done' : ''}${i + 1 === step ? ' is-current' : ''}`}
              aria-current={i + 1 === step ? 'step' : undefined}
            >
              <button
                type="button"
                className="step-btn"
                disabled={i + 1 > step}
                onClick={() => setStep(i + 1)}
                title={i + 1 < step ? `Back to ${label}` : undefined}
              >
                <span className="step-dot">{i + 1 < step ? <IconCheck /> : i + 1}</span>
                <span className="step-label">{label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="checkout-grid">
          <div className="checkout-main">
            {step === 1 && (
              <section className="co-panel">
                <h1 className="h2">Your dates</h1>
                <p className="muted co-hint">When does the journey begin?</p>
                <div className="co-dates">
                  <label>
                    <span className="field-label">Check in</span>
                    <input
                      type="date"
                      min={todayISO()}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        if (checkOut <= e.target.value) setCheckOut(addDays(e.target.value, 2))
                      }}
                    />
                  </label>
                  <label>
                    <span className="field-label">Check out</span>
                    <input
                      type="date"
                      min={checkIn}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </label>
                </div>
                <p className="co-nights muted">
                  {n} {n === 1 ? 'night' : 'nights'} · {fmtDate(checkIn)} – {fmtDate(checkOut)}
                </p>
              </section>
            )}

            {step === 2 && (
              <section className="co-panel">
                <h1 className="h2">Your guests</h1>
                <p className="muted co-hint">Who’s coming along?</p>
                <div className="sb-stepper co-stepper">
                  <button type="button" disabled={guests <= 1} onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Fewer guests">−</button>
                  <span>{guests}</span>
                  <button type="button" disabled={guests >= stay.guests} onClick={() => setGuests(Math.min(stay.guests, guests + 1))} aria-label="More guests">+</button>
                </div>
                <p className="co-nights muted">This home hosts up to {stay.guests} guests.</p>
              </section>
            )}

            {step === 3 && (
              <section className="co-panel">
                <h1 className="h2">Your information</h1>
                <p className="muted co-hint">For the reservation, and the welcome note.</p>
                {isMember && member ? (
                  <p className="co-signedin muted">
                    Signed in as <strong>{member.name}</strong> · {member.email}
                  </p>
                ) : (
                  <p className="co-signin muted">
                    <span>Booking as a guest —</span>
                    <SignInControl variant="checkout" label="sign in to autofill" />
                  </p>
                )}
                <DemoNotice />
                <div className="co-form">
                  <label>
                    <span className="field-label">Full name</span>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" autoComplete="name" />
                  </label>
                  <label>
                    <span className="field-label">Email</span>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@example.com" autoComplete="email" />
                  </label>
                  <label>
                    <span className="field-label">Mobile</span>
                    <input className="input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 917 000 0000" autoComplete="tel" />
                  </label>
                  <label>
                    <span className="field-label">Alternate number <em className="opt-tag">optional</em></span>
                    <input
                      className="input"
                      type="tel"
                      inputMode="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="A second number, a landline, a relative — any"
                      autoComplete="tel"
                    />
                  </label>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="co-panel">
                <h1 className="h2">Payment</h1>
                <p className="muted co-hint">No real money moves.</p>
                <DemoNotice />
                <div className="co-methods">
                  {PAYMENTS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`co-method${method === m ? ' is-active' : ''}`}
                      onClick={() => setMethod(m)}
                      aria-pressed={method === m}
                    >
                      <span>{m}</span>
                      {method === m && <IconCheck />}
                    </button>
                  ))}
                </div>
                <div className="co-partners">
                  <PaymentPartners compact faq />
                </div>
                <button type="button" className="btn btn--forest btn--lg btn--block" onClick={pay} disabled={processing}>
                  {processing ? 'Confirming…' : `Confirm and pay ${money(total)}`}
                </button>
                <p className="co-fineprint muted">
                  This is a demonstration. Clicking confirm only creates a
                  reservation in your browser.
                </p>
              </section>
            )}

            {step < 4 && (
              <div className="co-nav">
                {step > 1 && (
                  <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}>
                    Back
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={!canContinue}
                  onClick={() => setStep(step + 1)}
                >
                  Continue
                </button>
              </div>
            )}
          </div>

          {/* summary */}
          <aside className="co-side" aria-label="Booking summary">
            <p className="co-summary-label">Booking summary</p>
            <img className="co-img" src={stay.images[0]} alt={stay.name} />
            <p className="co-stayname">{stay.name}</p>
            <p className="muted">{stay.location}</p>
            <span className="rating co-rating">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3.4l2.3 5.2 5.7.5-4.3 3.7 1.3 5.6-5-3-5 3 1.3-5.6L4 9.1l5.7-.5z" />
              </svg>
              {stay.rating.toFixed(2)} <span className="muted">({stay.reviews})</span>
            </span>
            <div className="co-breakdown">
              <div className="bk-row">
                <span>{isMember ? 'Member rate' : 'Nightly rate'} · {money(q.nightlyRate)} × {n} {n === 1 ? 'night' : 'nights'}</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="bk-row"><span>Cleaning fee</span><span>{money(cleaning)}</span></div>
              <div className="bk-row"><span>PUNTA service fee</span><span>{money(serviceFee)}</span></div>
              <div className="bk-row bk-total"><span>Total</span><span>{money(total)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
 )
}
