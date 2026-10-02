import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Stay } from '../../types'
import { nights, todayISO, addDays } from '../../lib/format'
import { quote } from '../../lib/pricing'
import { useSession } from '../../state/SessionContext'
import { useRegion } from '../../state/RegionContext'
import './bookingcard.css'

export default function BookingCard({ stay }: { stay: Stay }) {
  const navigate = useNavigate()
  const { isMember, priceMultiplier } = useSession()
  const { money, t } = useRegion()
  const [checkIn, setCheckIn] = useState(addDays(todayISO(), 14))
  const [checkOut, setCheckOut] = useState(addDays(todayISO(), 16))
  const [guests, setGuests] = useState(Math.min(2, stay.guests))
  const [guestsOpen, setGuestsOpen] = useState(false)

  const n = nights(checkIn, checkOut)
  const q = quote(stay, priceMultiplier, n)
  const full = Math.round(stay.price)
  const saved = full - q.nightlyRate

  function reserve() {
    navigate(
      `/checkout/${stay.id}?in=${checkIn}&out=${checkOut}&g=${guests}`,
    )
  }

  return (
    <aside className="bk" aria-label="Book this stay">
      <div className="bk-top">
        <p className="bk-price">
          {isMember && saved > 0 && (
            <s className="bk-was">{money(full)}</s>
          )}
          <span className="price">{money(q.nightlyRate)}</span> <small>{t('card.night')}</small>
          {isMember && saved > 0 && (
            <span className="bk-save">{t('card.member')}</span>
          )}
        </p>
        <span className="rating">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M12 3.4l2.3 5.2 5.7.5-4.3 3.7 1.3 5.6-5-3-5 3 1.3-5.6L4 9.1l5.7-.5z" />
          </svg>
          {stay.rating.toFixed(2)}
          <span className="bk-reviews"> · {stay.reviews} reviews</span>
        </span>
      </div>

      <div className="bk-fields">
        <div className="bk-dates">
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

        <div className="bk-guests">
          <span className="field-label">Guests</span>
          <button
            type="button"
            className="bk-guests-btn"
            onClick={() => setGuestsOpen(!guestsOpen)}
            aria-expanded={guestsOpen}
          >
            {guests} {guests === 1 ? 'guest' : 'guests'}
          </button>
          {guestsOpen && (
            <div className="bk-guests-pop">
              <div className="sb-stepper">
                <button
                  type="button"
                  aria-label="Decrease guests"
                  disabled={guests <= 1}
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                >
                  −
                </button>
                <span>{guests}</span>
                <button
                  type="button"
                  aria-label="Increase guests"
                  disabled={guests >= stay.guests}
                  onClick={() => setGuests(Math.min(stay.guests, guests + 1))}
                >
                  +
                </button>
              </div>
              <p className="bk-guests-max">This place has a maximum of {stay.guests} guests.</p>
              <button type="button" className="sb-done" onClick={() => setGuestsOpen(false)}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <button type="button" className="btn btn--forest btn--block btn--lg bk-reserve" onClick={reserve}>
        Reserve
      </button>
      <p className="bk-charge">
        Demo only — please use fake details. You won’t be charged.
      </p>

      <div className="bk-breakdown">
        <div className="bk-row">
          <span>
            {money(q.nightlyRate)} × {q.nights} {q.nights === 1 ? t('search.night') : t('search.nights')}
          </span>
          <span>{money(q.subtotal)}</span>
        </div>
        <div className="bk-row">
          <span>Cleaning fee</span>
          <span>{money(q.cleaning)}</span>
        </div>
        <div className="bk-row">
          <span>PUNTA service fee</span>
          <span>{money(q.serviceFee)}</span>
        </div>
        <div className="bk-row bk-total">
          <span>Total</span>
          <span>{money(q.total)}</span>
        </div>
      </div>
    </aside>
  )
}
