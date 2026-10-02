import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const SESSION_KEY = 'punta.member.v1'
const BARDISMISS_KEY = 'punta.memberbar.dismissed.v1'

/** The member discount, as a fraction. One source of truth for the whole site. */
export const MEMBER_RATE = 0.1

export interface Member {
  name: string
  email: string
}

interface SessionState {
  member: Member | null
  isMember: boolean
  /** Multiplier applied to nightly prices: 0.9 for members, 1 otherwise. */
  priceMultiplier: number
  /** The top member bar was dismissed — stay hidden until membership changes. */
  barDismissed: boolean
  /** `name` is the full name captured at checkout; omit it and one is
   *  derived from the email handle instead. */
  signIn: (email: string, name?: string) => void
  signOut: () => void
  dismissBar: () => void
}

const SessionContext = createContext<SessionState | null>(null)

function load(): Member | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Member) : null
  } catch {
    return null
  }
}

function loadDismissed(): boolean {
  try {
    return localStorage.getItem(BARDISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(load)
  const [barDismissed, setBarDismissed] = useState<boolean>(loadDismissed)

  useEffect(() => {
    try {
      if (member) localStorage.setItem(SESSION_KEY, JSON.stringify(member))
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      /* storage unavailable — membership lives in memory */
    }
  }, [member])

  const signIn = useCallback((email: string, name?: string) => {
    const handle = email.split('@')[0] || 'Member'
    const derived = handle
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    setMember({ name: name?.trim() || derived, email })
    // the confirmation deserves one appearance — clear any dismissal
    setBarDismissed(false)
  }, [])

  const signOut = useCallback(() => {
    setMember(null)
    // the pitch becomes relevant again
    setBarDismissed(false)
  }, [])

  const dismissBar = useCallback(() => {
    setBarDismissed(true)
    try {
      localStorage.setItem(BARDISMISS_KEY, '1')
    } catch {
      /* in-memory only */
    }
  }, [])

  const value = useMemo<SessionState>(
    () => ({
      member,
      isMember: member !== null,
      priceMultiplier: member ? 1 - MEMBER_RATE : 1,
      barDismissed,
      signIn,
      signOut,
      dismissBar,
    }),
    [member, barDismissed, signIn, signOut, dismissBar],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
