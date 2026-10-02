import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Trip } from '../types'

const WISHLIST_KEY = 'punta.wishlist.v1'
const TRIPS_KEY = 'punta.trips.v1'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — state still works in-memory */
  }
}

interface AppState {
  wishlist: string[]
  trips: Trip[]
  isSaved: (id: string) => boolean
  toggleSave: (id: string) => void
  addTrip: (trip: Omit<Trip, 'id' | 'bookedAt'>) => void
  cancelTrip: (id: string) => void
  removeTrip: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // array-guard: stale or hand-edited storage must not crash the navbar
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const v = load<string[]>(WISHLIST_KEY, [])
    return Array.isArray(v) ? v : []
  })
  const [trips, setTrips] = useState<Trip[]>(() => {
    const v = load<Trip[]>(TRIPS_KEY, [])
    return Array.isArray(v) ? v : []
  })

  useEffect(() => {
    persist(WISHLIST_KEY, wishlist)
  }, [wishlist])

  useEffect(() => {
    persist(TRIPS_KEY, trips)
  }, [trips])

  const isSaved = useCallback((id: string) => wishlist.includes(id), [wishlist])

  const toggleSave = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const addTrip = useCallback((trip: Omit<Trip, 'id' | 'bookedAt'>) => {
    setTrips((prev) => [
      {
        ...trip,
        id: `t${Date.now().toString(36)}`,
        bookedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
  }, [])

  const cancelTrip = useCallback((id: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'cancelled' as const } : t)),
    )
  }, [])

  const removeTrip = useCallback((id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(
    () => ({ wishlist, trips, isSaved, toggleSave, addTrip, cancelTrip, removeTrip }),
    [wishlist, trips, isSaved, toggleSave, addTrip, cancelTrip, removeTrip],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
