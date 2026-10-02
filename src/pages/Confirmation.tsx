import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { IconArrowRight } from '../components/system/Icons'
import { DemoNotice } from '../components/system/DemoNotice'
import { getStay } from '../data/properties'
import { fmtDate, peso } from '../lib/format'
import { useApp } from '../state/AppContext'
import { useSession } from '../state/SessionContext'
import './confirmation.css'

export interface Contact {
  name: string
  email: string
  phone: string
}

interface ConfirmState {
  checkIn?: string
  checkOut?: string
  guests?: number
  total?: number
  method?: string
  /** The details the guest is asked to check before the trip is written. */
  contact?: Contact
  /** Set once they have confirmed — this is what saves the reservation. */
  confirmed?: boolean
  /** True when this booking is what created the guest's account. */
  created?: boolean
}

/**
 * THE CONFIRMATION STEP.
 *
 * The reservation is deliberately NOT saved by the checkout — paying only
 * carries the booking here. This page is the one place `addTrip` is called,
 * and it happens after the guest has read the name, email and number the
 * reservation (and their new account) will be reached at. A typo caught
 * here never becomes an unreachable booking.
 *
 * Confirming replaces the history entry instead of pushing a new one, so a
 * refresh lands back on the saved state rather than the form — otherwise a
 * reload could write a second reservation.
 */
export default function Confirmation() {
  const { id } = useParams()
  const stay = getStay(id)
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as ConfirmState
  const { addTrip } = useApp()
  const { member, signIn } = useSession()

  const [contact, setContact] = useState<Contact>(
    () => state.contact ?? { name: '', email: '', phone: '' },
  )
  const [saving, setSaving] = useState(false)
  const [drawn, setDrawn] = useState(false)

  const confirmed = Boolean(state.confirmed)
  const reviewing = Boolean(state.contact) && !confirmed

  useEffect(() => {
    if (!confirmed) return
    const t = window.setTimeout(() => setDrawn(true), 220)
    return () => window.clearTimeout(t)
  }, [confirmed])

  if (!stay) {
    return (
      <div className="shell conf-missing">
        <p className="h1">We couldn’t find that reservation.</p>
        <Link to="/explore" className="btn btn--primary">Browse stays</Link>
      </div>
    )
  }

  const nameOk = contact.name.trim().length > 1
  const emailOk = contact.email.includes('@') && contact.email.includes('.')
  const phoneOk = contact.phone.trim().length > 6
  const canConfirm = nameOk && emailOk && phoneOk

  const confirm = () => {
    if (!canConfirm || saving) return
    setSaving(true)

    // the ONLY write — the reservation exists from here on
    addTrip({
      stayId: stay.id,
      status: 'upcoming',
      checkIn: state.checkIn ?? '',
      checkOut: state.checkOut ?? '',
      guests: state.guests ?? 2,
      total: state.total ?? 0,
      paymentMethod: state.method ?? 'GCash',
    })

    // the booking details ARE the account: created, or corrected if the
    // guest fixed a typo above
    const wasGuest = !member
    signIn(contact.email.trim(), contact.name.trim())

    navigate(location.pathname, {
      replace: true,
      state: { ...state, contact, confirmed: true, created: wasGuest },
    })
  }

  return (
    <div className="conf">
      {/* the horizon draws itself — no confetti, just architecture */}
      <svg className="conf-horizon" viewBox="0 0 1200 320" aria-hidden="true">
        <path
          className={`conf-line${drawn ? ' is-drawn' : ''}`}
          d="M0 200 H420 C560 200 620 120 760 120 C900 120 980 200 1200 200"
          fill="none"
          stroke="var(--sand)"
          strokeWidth="1.6"
        />
        <path
          className={`conf-line conf-line--slow${drawn ? ' is-drawn' : ''}`}
          d="M0 244 H360 C520 244 600 168 740 168 C900 168 990 244 1200 244"
          fill="none"
          stroke="var(--stone-light)"
          strokeWidth="1"
        />
        <circle className={`conf-sun${drawn ? ' is-drawn' : ''}`} cx="760" cy="120" r="5" fill="var(--forest)" />
      </svg>

      {reviewing ? (
        <div className="shell conf-body">
          <p className="eyebrow eyebrow--dark">One last step</p>
          <h1 className="display conf-title">Check your details.</h1>
          <p className="conf-lede muted">
            Your dates are held, not booked. Confirm how we reach you and the
            reservation is saved.
          </p>

          <div className="conf-card">
            <img src={stay.images[0]} alt={stay.name} />
            <div className="conf-info">
              <p className="conf-name h2">{stay.name}</p>
              <p className="conf-where muted">{stay.location}</p>
              <p className="conf-dates">
                {state.checkIn && state.checkOut
                  ? `${fmtDate(state.checkIn)} – ${fmtDate(state.checkOut)}`
                  : 'Dates to be confirmed with your host'}
                {' · '}
                {state.guests ?? 2} guests
              </p>
              {state.total && (
                <p className="conf-total muted">
                  {peso(state.total)} with {state.method ?? 'GCash'} (simulated)
                </p>
              )}
            </div>
          </div>

          <div className="conf-review">
            <p className="conf-review-head">Where should we reach you?</p>
            <DemoNotice variant="inline" />
            <div className="conf-fields">
              <label>
                <span className="field-label">Full name</span>
                <input
                  className="input"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  autoComplete="name"
                />
              </label>
              <label>
                <span className="field-label">Email</span>
                <input
                  className="input"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  autoComplete="email"
                />
              </label>
              <label>
                <span className="field-label">Mobile</span>
                <input
                  className="input"
                  type="tel"
                  inputMode="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  autoComplete="tel"
                />
              </label>
            </div>
            <button
              type="button"
              className="btn btn--primary btn--lg"
              disabled={!canConfirm || saving}
              onClick={confirm}
            >
              {saving ? 'Saving…' : 'Confirm reservation'}
            </button>
            <p className="conf-hold muted">
              Nothing is saved until you confirm — no reservation appears in
              your trips before then.
            </p>
          </div>

          <Link to={`/stay/${stay.id}`} className="conf-back">
            ← Back to {stay.name}
          </Link>
        </div>
      ) : (
        <div className="shell conf-body">
          <p className="eyebrow eyebrow--dark">Reservation confirmed</p>
          <h1 className="display conf-title">You’re going somewhere.</h1>

          <div className="conf-card">
            <img src={stay.images[0]} alt={stay.name} />
            <div className="conf-info">
              <p className="conf-name h2">{stay.name}</p>
              <p className="conf-where muted">{stay.location}</p>
              <p className="conf-dates">
                {state.checkIn && state.checkOut
                  ? `${fmtDate(state.checkIn)} – ${fmtDate(state.checkOut)}`
                  : 'Dates to be confirmed with your host'}
                {' · '}
                {state.guests ?? 2} guests
              </p>
              {state.total && (
                <p className="conf-total muted">
                  {peso(state.total)} paid with {state.method ?? 'GCash'} (simulated)
                </p>
              )}
            </div>
          </div>

          {state.created && member && (
            <p className="conf-account muted">
              Your PUNTA account is ready —{' '}
              <strong>{member.email}</strong>. Member rates now apply from your
              next stay.
            </p>
          )}

          <div className="conf-actions">
            <Link to="/trips" className="btn btn--primary">
              View trip <IconArrowRight />
            </Link>
            <Link to={`/stay/${stay.id}`} className="btn btn--ghost">Message host</Link>
            <Link to={`/stay/${stay.id}`} className="btn btn--ghost">Get directions</Link>
          </div>

          <p className="conf-note muted">
            A confirmation note would normally arrive by email. Your host has been
            notified — pack light, arrive curious.
          </p>
        </div>
      )}
    </div>
  )
}
