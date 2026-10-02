import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const TRIP_KEY = 'punta.mytrip.v1'

export type TripKind = 'stay' | 'experience' | 'dining' | 'transport'

export interface TripItem {
  id: string // unique instance id
  kind: TripKind
  refId: string // id in its own data file
  name: string
  detail: string // location · duration · etc.
  price: number // PHP
  image: string
  day: number // 1-based day assignment
  note: string
  addedAt: string
}

interface MyTripState {
  items: TripItem[]
  days: number
  tripName: string
  addItems: (items: Omit<TripItem, 'id' | 'day' | 'note' | 'addedAt'>[]) => void
  removeItem: (id: string) => void
  assignDay: (id: string, day: number) => void
  setNote: (id: string, note: string) => void
  setDays: (n: number) => void
  setTripName: (name: string) => void
  clearTrip: () => void
  inTrip: (refId: string) => boolean
}

const MyTripContext = createContext<MyTripState | null>(null)

function load(): { items: TripItem[]; days: number; tripName: string } {
  const fallback = { items: [], days: 3, tripName: 'My Philippine journey' }
  try {
    const raw = localStorage.getItem(TRIP_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<{ items: TripItem[]; days: number; tripName: string }>
    // stale or hand-edited storage must never take the planner down
    return {
      items: Array.isArray(parsed.items) ? parsed.items : fallback.items,
      days:
        typeof parsed.days === 'number'
          ? Math.min(14, Math.max(1, Math.round(parsed.days)))
          : fallback.days,
      tripName:
        typeof parsed.tripName === 'string' ? parsed.tripName : fallback.tripName,
    }
  } catch {
    return fallback
  }
}

export function MyTripProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(TRIP_KEY, JSON.stringify(state))
    } catch { /* in-memory only */ }
  }, [state])

  const addItems = useCallback((newItems: Omit<TripItem, 'id' | 'day' | 'note' | 'addedAt'>[]) => {
    setState((s) => {
      const next = [...s.items]
      for (const item of newItems) {
        if (next.some((i) => i.refId === item.refId)) continue // no duplicates
        next.push({
          ...item,
          id: `ti${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
          day: 1,
          note: '',
          addedAt: new Date().toISOString(),
        })
      }
      return { ...s, items: next }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }))
  }, [])

  const assignDay = useCallback((id: string, day: number) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, day } : i)),
    }))
  }, [])

  const setNote = useCallback((id: string, note: string) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, note } : i)),
    }))
  }, [])

  const setDays = useCallback((n: number) => {
    setState((s) => ({ ...s, days: Math.min(14, Math.max(1, n)) }))
  }, [])

  const setTripName = useCallback((name: string) => {
    setState((s) => ({ ...s, tripName: name }))
  }, [])

  const clearTrip = useCallback(() => {
    setState((s) => ({ ...s, items: [] }))
  }, [])

  const inTrip = useCallback(
    (refId: string) => state.items.some((i) => i.refId === refId),
    [state.items],
  )

  const value = useMemo<MyTripState>(
    () => ({
      ...state,
      addItems,
      removeItem,
      assignDay,
      setNote,
      setDays,
      setTripName,
      clearTrip,
      inTrip,
    }),
    [state, addItems, removeItem, assignDay, setNote, setDays, setTripName, clearTrip, inTrip],
  )

  return <MyTripContext.Provider value={value}>{children}</MyTripContext.Provider>
}

export function useMyTrip(): MyTripState {
  const ctx = useContext(MyTripContext)
  if (!ctx) throw new Error('useMyTrip must be used within MyTripProvider')
  return ctx
}
