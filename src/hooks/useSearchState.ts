import { useCallback, useState } from 'react'
import { addDays, todayISO } from '../lib/format'
import type { GuestSummary } from '../types'

export interface SearchState {
  where: string
  checkIn: string
  checkOut: string
  guests: GuestSummary
}

export function useSearchState(initial?: Partial<SearchState>) {
  const [where, setWhere] = useState(initial?.where ?? '')
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? addDays(todayISO(), 30))
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? addDays(todayISO(), 33))
  const [guests, setGuests] = useState<GuestSummary>(
    initial?.guests ?? { adults: 2, children: 0, infants: 0 },
  )

  const totalGuests = guests.adults + guests.children

  const guestLabel =
    totalGuests === 1 ? '1 guest' : `${totalGuests} guests`

  const toQuery = useCallback(() => {
    const p = new URLSearchParams()
    if (where) p.set('where', where)
    p.set('in', checkIn)
    p.set('out', checkOut)
    p.set('g', String(totalGuests))
    return p.toString()
  }, [where, checkIn, checkOut, totalGuests])

  const fromQuery = useCallback((q: URLSearchParams): Partial<SearchState> => {
    const out: Partial<SearchState> = {}
    const w = q.get('where')
    const i = q.get('in')
    const o = q.get('out')
    const g = q.get('g')
    if (w) out.where = w
    if (i) out.checkIn = i
    if (o) out.checkOut = o
    if (g) out.guests = { adults: Number(g) || 2, children: 0, infants: 0 }
    return out
  }, [])

  return {
    where,
    setWhere,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    totalGuests,
    guestLabel,
    toQuery,
    fromQuery,
  }
}
