import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESTINATION_NAMES } from '../../data/destinations'
import { useSearchState } from '../../hooks/useSearchState'
import { addDays, fmtDate, nights, todayISO } from '../../lib/format'
import { STAYS } from '../../data/properties'
import { IconSearch } from '../system/Icons'
import './searchbar.css'

/** Live stay counts per destination — derived from the data, never hardcoded. */
const DEST_COUNTS: Record<string, number> = DESTINATION_NAMES.reduce(
  (acc, name) => {
    acc[name] = STAYS.filter((stay) => stay.location.includes(name)).length
    return acc
  },
  {} as Record<string, number>,
)

interface Props {
  variant?: 'hero' | 'panel'
  initial?: { where?: string; checkIn?: string; checkOut?: string; guests?: number }
}

const DEST_LINES: Record<string, string> = {
  Palawan: 'Blue horizons. Slow mornings.',
  Siargao: 'Salt air. Barefoot afternoons.',
  Baguio: 'Cool mornings above the clouds.',
  Batangas: 'Your weekend, closer than you think.',
  Cebu: 'Old streets, open water.',
  'La Union': 'Sunsets worth the drive.',
  Boracay: 'White sand, soft evenings.',
  Tagaytay: 'Fog, ridges, and warm soup.',
}

function nextFridayISO(): string {
  const d = new Date(todayISO())
  const offset = (5 - d.getDay() + 7) % 7 || 7 // upcoming Friday, never today
  return addDays(todayISO(), offset)
}

export default function SearchBar({ variant = 'hero', initial }: Props) {
  const navigate = useNavigate()
  const s = useSearchState(
    initial
      ? {
          where: initial.where,
          checkIn: initial.checkIn,
          checkOut: initial.checkOut,
          guests: { adults: initial.guests ?? 2, children: 0, infants: 0 },
        }
      : undefined,
  )
  const [open, setOpen] = useState<null | 'where' | 'dates' | 'guests'>(null)
  const [suggestion, setSuggestion] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function submit() {
    navigate(`/explore?${s.toQuery()}`)
  }

  function pickWhere(name: string) {
    s.setWhere(name)
    setSuggestion('')
    setOpen(null)
    navigate(`/explore?where=${encodeURIComponent(name)}&in=${s.checkIn}&out=${s.checkOut}&g=${s.totalGuests}`)
  }

  function setRange(inISO: string, outISO: string) {
    s.setCheckIn(inISO)
    s.setCheckOut(outISO)
  }

  function toggle(field: 'dates' | 'guests') {
    setOpen(open === field ? null : field)
  }

  const matches =
    suggestion.trim().length > 0
      ? DESTINATION_NAMES.filter((d) =>
          d.toLowerCase().includes(suggestion.toLowerCase()),
        )
      : DESTINATION_NAMES

  const n = nights(s.checkIn, s.checkOut)

  return (
    <div
      ref={rootRef}
      className={`searchbar searchbar--${variant}${open ? ' is-open' : ''}`}
      role="search"
      aria-label="Search stays"
    >
      {/* ————— WHERE ————— */}
      <div className={`sb-field sb-field--where${open === 'where' ? ' is-active' : ''}`}>
        <label className="sb-head" htmlFor="sb-where">
          <span className="field-label">Where</span>
          <input
            id="sb-where"
            className="sb-input"
            type="text"
            placeholder="Search destinations"
            value={s.where || suggestion}
            autoComplete="off"
            onFocus={() => setOpen('where')}
            onChange={(e) => {
              s.setWhere(e.target.value)
              setSuggestion(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (matches.length > 0 && suggestion.trim()) pickWhere(matches[0])
                else submit()
              }
            }}
          />
        </label>
        {open === 'where' && (
          <div className="sb-pop sb-pop--where" role="listbox" aria-label="Destination suggestions">
            <p className="sb-pop-title">Destinations</p>
            <div className="sb-destgrid">
              {matches.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="option"
                  aria-selected={s.where === d}
                  className="sb-dest"
                  onClick={() => pickWhere(d)}
                >
                  <span className="sb-dest-name">{d}</span>
                  <span className="sb-dest-sub">{DEST_LINES[d]}</span>
                  <span className="sb-dest-count">
                    {DEST_COUNTS[d]} {DEST_COUNTS[d] === 1 ? 'stay' : 'stays'}
                  </span>
                </button>
              ))}
            </div>
            {matches.length === 0 && (
              <p className="sb-pop-empty">
                No matches — try Palawan, Siargao, or Baguio.
              </p>
            )}
          </div>
        )}
      </div>

      <span className="sb-divider" aria-hidden="true" />

      {/* ————— DATES ————— */}
      <div className={`sb-field sb-field--dates${open === 'dates' ? ' is-active' : ''}`}>
        <button
          type="button"
          className="sb-head"
          onClick={() => toggle('dates')}
          aria-expanded={open === 'dates'}
          aria-haspopup="dialog"
        >
          <span className="field-label">Dates</span>
          <span className={`sb-value${s.checkIn && s.checkOut ? '' : ' is-placeholder'}`}>
            {s.checkIn && s.checkOut
              ? `${fmtDate(s.checkIn)} – ${fmtDate(s.checkOut)}`
              : 'Add dates'}
          </span>
        </button>

        {open === 'dates' && (
          <div className="sb-pop sb-pop--dates" role="dialog" aria-label="Choose dates">
            <div className="sb-chips" role="group" aria-label="Quick date ranges">
              <button
                type="button"
                className="chip sb-chip"
                onClick={() => setRange(nextFridayISO(), addDays(nextFridayISO(), 2))}
              >
                This weekend
              </button>
              <button
                type="button"
                className="chip sb-chip"
                onClick={() => setRange(addDays(todayISO(), 7), addDays(todayISO(), 9))}
              >
                Next week
              </button>
              <button
                type="button"
                className="chip sb-chip"
                onClick={() => setRange(addDays(todayISO(), 14), addDays(todayISO(), 21))}
              >
                A full week
              </button>
            </div>

            <div className="sb-date-grid">
              <label className="sb-date">
                <span className="field-label">Check in</span>
                <input
                  type="date"
                  min={todayISO()}
                  value={s.checkIn}
                  onChange={(e) => {
                    s.setCheckIn(e.target.value)
                    if (s.checkOut <= e.target.value) {
                      s.setCheckOut(addDays(e.target.value, 2))
                    }
                  }}
                />
              </label>
              <label className="sb-date">
                <span className="field-label">Check out</span>
                <input
                  type="date"
                  min={s.checkIn}
                  value={s.checkOut}
                  onChange={(e) => s.setCheckOut(e.target.value)}
                />
              </label>
            </div>

            <p className="sb-nights" aria-live="polite">
              {n > 0 ? (
                <>
                  <strong>{n}</strong> {n === 1 ? 'night' : 'nights'} ·{' '}
                  {fmtDate(s.checkIn)} – {fmtDate(s.checkOut)}
                </>
              ) : (
                'Pick a check-out date after check-in.'
              )}
            </p>

            <button type="button" className="sb-done" onClick={() => setOpen(null)}>
              Done
            </button>
          </div>
        )}
      </div>

      <span className="sb-divider" aria-hidden="true" />

      {/* ————— GUESTS ————— */}
      <div className={`sb-field sb-field--guests${open === 'guests' ? ' is-active' : ''}`}>
        <button
          type="button"
          className="sb-head"
          onClick={() => toggle('guests')}
          aria-expanded={open === 'guests'}
          aria-haspopup="dialog"
        >
          <span className="field-label">Guests</span>
          <span className={`sb-value${s.totalGuests ? '' : ' is-placeholder'}`}>
            {s.totalGuests ? s.guestLabel : 'Add guests'}
          </span>
        </button>

        {open === 'guests' && (
          <div className="sb-pop sb-pop--guests" role="dialog" aria-label="Choose guests">
            {(
              [
                ['adults', 'Adults', 'Ages 13 or above'],
                ['children', 'Children', 'Ages 2–12'],
                ['infants', 'Infants', 'Under 2'],
              ] as const
            ).map(([key, label, sub]) => (
              <div key={key} className="sb-guest-row">
                <div>
                  <p className="sb-guest-label">{label}</p>
                  <p className="sb-guest-sub">{sub}</p>
                </div>
                <div className="sb-stepper">
                  <button
                    type="button"
                    aria-label={`Decrease ${label}`}
                    disabled={s.guests[key] === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      const next = { ...s.guests }
                      next[key] = Math.max(0, next[key] - 1)
                      s.setGuests(next)
                    }}
                  >
                    −
                  </button>
                  <span aria-live="polite">{s.guests[key]}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${label}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      const next = { ...s.guests }
                      next[key] = Math.min(16, next[key] + 1)
                      s.setGuests(next)
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <p className="sb-nights" aria-live="polite">
              {s.guests.infants > 0
                ? `${s.guests.infants} ${s.guests.infants === 1 ? 'infant' : 'infants'} don’t count toward the guest total.`
                : `${s.totalGuests} ${s.totalGuests === 1 ? 'guest' : 'guests'} in total`}
            </p>

            <button type="button" className="sb-done" onClick={() => setOpen(null)}>
              Done
            </button>
          </div>
        )}
      </div>

      {/* ————— SUBMIT ————— */}
      <button type="button" className="sb-submit" onClick={submit} aria-label="Search">
        <IconSearch className="sb-search-icon" />
        <span className="sb-submit-label">Search</span>
      </button>
    </div>
  )
}
