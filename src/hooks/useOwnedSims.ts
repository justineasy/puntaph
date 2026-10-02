import { useEffect, useState } from 'react'

/**
 * eSIM ownership — read once from localStorage, then kept live via a
 * custom window event so the navbar badge updates the instant a
 * purchase, activation, or refund lands on the eSIM page.
 */

const OWNED_KEY = 'punta.esims.v1'
const EVENT = 'punta:esims-changed'

const DAY = 86_400_000

interface StoredSim {
  status?: string
  activatedAt?: string
  purchasedAt?: string
  days?: number
  /** Email of the account that bought it. Absent only on sims bought
   *  before eSIMs required an account; the eSIM page claims those for the
   *  first account that signs in, so they end up with a real owner. */
  owner?: string
}

/**
 * An eSIM only belongs to a signed-in account. Signed out there is no
 * library at all — no badge, no dot, no refunded receipts. An owner-less
 * sim counts as unclaimed and shows only to the account that adopts it.
 */
function visibleTo(sim: StoredSim, owner?: string): boolean {
  if (!owner) return false
  return !sim.owner || sim.owner === owner
}

export interface SimCounts {
  /** eSIMs you hold and can still use (ready or active) — refunded don't count. */
  owned: number
  /** eSIMs currently subscribed (activated). */
  active: number
  /** Bought but not yet activated — the only state that needs an action. */
  ready: number
  /** Urgency of the soonest-expiring active eSIM: none / soon (<48h) / out (<24h). */
  expiring: 'none' | 'soon' | 'out'
}

export function readSimCounts(owner?: string): SimCounts {
  try {
    const raw = localStorage.getItem(OWNED_KEY)
    const all = raw ? (JSON.parse(raw) as StoredSim[]) : []
    const sims = all.filter((s) => visibleTo(s, owner))
    const active = sims.filter((s) => s.status === 'active')
    const now = Date.now()
    let minLeft = Infinity
    for (const s of active) {
      const start = Date.parse(s.activatedAt ?? s.purchasedAt ?? '')
      if (Number.isNaN(start)) continue
      minLeft = Math.min(minLeft, start + (s.days ?? 1) * DAY - now)
    }
    return {
      owned: sims.filter((s) => s.status !== 'refunded').length,
      active: active.length,
      ready: sims.filter((s) => s.status !== 'refunded' && s.status !== 'active').length,
      expiring:
        minLeft === Infinity
          ? 'none'
          : minLeft <= DAY
            ? 'out'
            : minLeft <= 2 * DAY
              ? 'soon'
              : 'none',
    }
  } catch {
    return { owned: 0, active: 0, ready: 0, expiring: 'none' }
  }
}

export function useOwnedSims(owner?: string): SimCounts {
  const [counts, setCounts] = useState<SimCounts>(() => readSimCounts(owner))

  useEffect(() => {
    const sync = () => setCounts(readSimCounts(owner))
    sync() // signs in or out mid-session → recount for the new account
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync) // other tabs
    // expiries creep forward on their own — keep the warning honest
    const t = window.setInterval(sync, 60_000)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
      window.clearInterval(t)
    }
  }, [owner])

  return counts
}

/** Called by the eSIM page whenever a purchase, activation, or refund lands. */
export function notifyEsimsChanged() {
  window.dispatchEvent(new Event(EVENT))
}
