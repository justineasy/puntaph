import { useEffect, useRef, useState } from 'react'
import { SectionHeading } from '../../components/system/SectionHeading'
import { Reveal } from '../../components/system/Reveal'
import { ESIM_PACKAGES, ESIM_STEPS } from '../../data/platform'
import { useRegion } from '../../state/RegionContext'
import { useSession } from '../../state/SessionContext'
import { IconCheck } from '../../components/system/Icons'
import { DemoNotice } from '../../components/system/DemoNotice'
import { notifyEsimsChanged } from '../../hooks/useOwnedSims'
import '../platform.css'

const OWNED_KEY = 'punta.esims.v1'

interface OwnedSim {
  id: string
  packageId: string
  dataGb: number
  days: number
  iccid: string
  purchasedAt: string
  status: 'ready to activate' | 'active' | 'refunded'
  activatedAt?: string
  refundedAt?: string
  /** Email of the account that bought it — a refund has somewhere to go. */
  owner?: string
}

/** Deterministic per-sim hash — the same eSIM always tells the same story. */
function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const DAY = 86_400_000

/**
 * Simulated consumption: an arrival burst (maps, cabs, the group chat) plus
 * a steady daily burn, tracked in real time against the plan window.
 */
function usageFor(sim: OwnedSim, now: number) {
  const start = Date.parse(sim.activatedAt ?? sim.purchasedAt)
  const burst = sim.dataGb * (0.15 + ((hashStr(sim.id) % 30) / 100))
  const elapsed = Math.max(0, (now - start) / DAY)
  const used = Math.min(sim.dataGb, burst + elapsed * (sim.dataGb / sim.days))
  const msLeft = start + sim.days * DAY - now
  return { used, total: sim.dataGb, msLeft, pct: used / sim.dataGb }
}

function countdown(ms: number): { text: string; tone: 'ok' | 'soon' | 'out' } {
  if (ms <= 0) return { text: 'Expired', tone: 'out' }
  const h = Math.floor(ms / 3_600_000)
  if (h < 48) {
    const m = Math.floor((ms % 3_600_000) / 60_000)
    return { text: `${h}h ${m}m left`, tone: h < 24 ? 'out' : 'soon' }
  }
  return { text: `${Math.ceil(h / 24)} days left`, tone: 'ok' }
}

/** Data bar + expiry ticker for an active eSIM — recomputes every minute. */
function UsageBar({ sim }: { sim: OwnedSim }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  const u = usageFor(sim, now)
  const c = countdown(u.msLeft)

  return (
    <span className={`esim-usage${c.tone !== 'ok' || u.pct >= 0.9 ? ' is-urgent' : ''}`}>
      <span className="esim-usage-head">
        <span>
          {u.used.toFixed(1)} of {u.total} GB used
        </span>
        <span className={`esim-usage-left is-${c.tone}`}>{c.text}</span>
      </span>
      <span className="esim-usage-bar">
        <span style={{ width: `${Math.min(100, u.pct * 100)}%` }} />
      </span>
    </span>
  )
}

function loadOwned(): OwnedSim[] {
  try {
    return JSON.parse(localStorage.getItem(OWNED_KEY) ?? '[]')
  } catch {
    return []
  }
}

/**
 * eSIM — fully simulated. The purchase endpoint is one async function
 * (`purchase()` below) so a real provider SDK can drop in later without
 * touching the UI. No API keys, no network calls.
 */
export default function EsimPage() {
  const { money } = useRegion()
  const { member, signIn } = useSession()
  const [selected, setSelected] = useState(ESIM_PACKAGES[0].id)
  const [owned, setOwned] = useState<OwnedSim[]>(loadOwned)
  const [busy, setBusy] = useState(false)
  const [justBought, setJustBought] = useState<OwnedSim | null>(null)
  // which eSIM is awaiting a refund confirmation — inline, like trip cancel
  const [refundAskingId, setRefundAskingId] = useState<string | null>(null)
  // an eSIM needs an account, so buying is gated behind this prompt
  const [gateOpen, setGateOpen] = useState(false)
  const [gateEmail, setGateEmail] = useState('')
  const libraryRef = useRef<HTMLElement>(null)

  const pkg = ESIM_PACKAGES.find((p) => p.id === selected) ?? ESIM_PACKAGES[0]

  // the cheapest data per GB in the set earns the only tag on the grid
  const bestValueId = ESIM_PACKAGES.reduce((best, p) =>
    p.price / p.dataGb < best.price / best.dataGb ? p : best,
  ).id

  // An eSIM belongs to the account that bought it — and to nobody when no
  // one is signed in. Signed out, the library simply does not exist: no
  // active plan, no refunded receipts.
  const mine = member
    ? owned.filter((s) => !s.owner || s.owner === member.email)
    : []

  // how many usable sims the user holds per package — drives the Owned badges
  // (refunded sims don't badge the card — you don't own them anymore)
  const ownedCounts = mine.reduce<Record<string, number>>((m, sim) => {
    if (sim.status === 'refunded') return m
    m[sim.packageId] = (m[sim.packageId] ?? 0) + 1
    return m
  }, {})

  // Refunded plans are receipts, not plans — they leave the working list
  // entirely and fold into their own archive. Without this the library
  // buries the one eSIM that matters under a wall of cancelled ones.
  const current = mine.filter((s) => s.status !== 'refunded')
  const refunded = mine.filter((s) => s.status === 'refunded')

  const pkgPrice = (id: string) => ESIM_PACKAGES.find((p) => p.id === id)?.price ?? 0

  // One-time adoption: eSIMs recorded before ownership existed are claimed
  // by the first account that signs in, so they get a real owner instead of
  // floating between whoever happens to be on this browser.
  useEffect(() => {
    if (!member) return
    if (!owned.some((s) => !s.owner)) return
    persist(owned.map((s) => (s.owner ? s : { ...s, owner: member.email })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member])

  function persist(next: OwnedSim[]) {
    setOwned(next)
    try {
      localStorage.setItem(OWNED_KEY, JSON.stringify(next))
    } catch { /* in-memory only */ }
    notifyEsimsChanged() // navbar updates instantly
  }

  function activate(id: string) {
    persist(
      owned.map((s) =>
        s.id === id
          ? { ...s, status: 'active' as const, activatedAt: new Date().toISOString().slice(0, 10) }
          : s,
      ),
    )
  }

  function refund(id: string) {
    const sim = owned.find((s) => s.id === id)
    if (!sim || sim.status === 'active') return // activated eSIMs are non-refundable
    persist(
      owned.map((s) =>
        s.id === id ? { ...s, status: 'refunded' as const, refundedAt: new Date().toISOString().slice(0, 10) } : s,
      ),
    )
  }

  /** The buy button — signed in buys directly, guests get the prompt. */
  function startPurchase() {
    if (member) purchase(member.email)
    else setGateOpen(true)
  }

  /** Sign in with the address they typed, then continue the purchase. */
  function signInAndBuy(e: React.FormEvent) {
    e.preventDefault()
    const email = gateEmail.trim()
    if (!email.includes('@')) return
    signIn(email)
    setGateOpen(false)
    setGateEmail('')
    purchase(email)
  }

  function purchase(owner: string) {
    setBusy(true)
    // MOCK PURCHASE — replace with provider API call.
    window.setTimeout(() => {
      const sim: OwnedSim = {
        id: `sim${Date.now().toString(36)}`,
        packageId: pkg.id,
        dataGb: pkg.dataGb,
        days: pkg.days,
        iccid: `89${Math.floor(1e13 + Math.random() * 9e13)}`,
        purchasedAt: new Date().toISOString().slice(0, 10),
        status: 'ready to activate',
        owner,
      }
      persist([sim, ...owned])
      setBusy(false)
      setJustBought(sim)
      // walk the eye down to where the new eSIM landed
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      libraryRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }, 1200)
  }

  return (
    <div className="pl shell">
      <header className="pl-hero">
        <SectionHeading
          eyebrow="Connected, from touchdown"
          title={
            <>
              Land online.
              <br />
              No queues.
            </>
          }
          dek="A Philippine data plan that lives on your phone before you fly. Scan one QR code at arrivals and skip the airport SIM counter entirely."
        />
      </header>

      <div className="esim-grid">
        {ESIM_PACKAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`esim-card${selected === p.id ? ' is-selected' : ''}`}
            onClick={() => setSelected(p.id)}
            aria-pressed={selected === p.id}
          >              {(ownedCounts[p.id] ?? 0) > 0 && (
                <span className="esim-owned-badge">
                  <IconCheck /> Owned{(ownedCounts[p.id] ?? 0) > 1 ? ` ×${ownedCounts[p.id]}` : ''}
                </span>
              )}
              <span className="esim-gb">
                {p.dataGb}
                <small> GB</small>
              </span>
              <span className="esim-days-row">
                <span className="esim-days">{p.days} days · {p.region}</span>
                {/* the one earned tag — it goes to the cheapest data in the set,
                    so it stays honest if the packages change */}
                {p.id === bestValueId && <span className="esim-tag">Best value</span>}
              </span>
              <span className="esim-net">{p.network} · {p.speed}</span>
              <span className="esim-price">
                {money(p.price)}
                {selected === p.id && <IconCheck />}
              </span>
              {/* the two figures that actually decide a plan */}
              <span className="esim-value">
                ≈ {money(Math.round(p.price / p.days))} a day ·{' '}
                {money(Math.round(p.price / p.dataGb))} per GB
              </span>
          </button>
        ))}
      </div>

      <div className="esim-buy">
        <button
          type="button"
          className="btn btn--forest btn--lg"
          onClick={startPurchase}
          disabled={busy}
        >
          {busy ? 'Preparing your eSIM…' : `Buy ${pkg.dataGb} GB / ${pkg.days} days — ${money(pkg.price)}`}
        </button>
        <DemoNotice variant="inline" />
      </div>

      {gateOpen && !member && (
        <form className="esim-gate" onSubmit={signInAndBuy}>
          <p className="esim-gate-head">An eSIM needs an account</p>
          <p className="esim-gate-sub muted">
            The plan runs on your phone, but the QR, the data counter and any
            refund are tied to your PUNTA account.
          </p>
          <DemoNotice />
          <label className="esim-gate-field">
            <span className="field-label">Email</span>
            <input
              className="input"
              type="email"
              value={gateEmail}
              onChange={(e) => setGateEmail(e.target.value)}
              placeholder="juan@example.com"
              autoComplete="email"
              autoFocus
            />
          </label>
          <div className="esim-gate-actions">
            <button
              type="submit"
              className="btn btn--forest"
              disabled={!gateEmail.includes('@')}
            >
              Sign in &amp; buy
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setGateOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {justBought && (
        <div className="esim-success" role="status">
          <IconCheck />
          <span>
            <strong>Your eSIM is ready.</strong> ICCID {justBought.iccid} — saved to Your eSIMs below,
            ready to activate whenever you land.
          </span>
        </div>
      )}

      <h2 className="h3" style={{ marginTop: 44 }}>Activation — four steps, two minutes</h2>
      <div className="esim-steps">
        {ESIM_STEPS.map((s) => (
          <p className="esim-step" key={s}>{s}</p>
        ))}
      </div>

      {mine.length > 0 && (
        <section className="section section--tight" style={{ paddingBlock: '44px 0' }} ref={libraryRef}>
          {current.length > 0 ? (
            <>
              <h2 className="h3">
                Your eSIMs <span className="esim-count">({current.length})</span>
              </h2>
              <div className="esim-legend" aria-hidden="true">
                <span><i className="esim-dot esim-dot--ready" /> Ready — refundable until activated</span>
                <span><i className="esim-dot esim-dot--active" /> Active — subscribed, using data</span>
              </div>
            </>
          ) : (
            <h2 className="h3">Your eSIMs</h2>
          )}
          <div className="esim-owned" style={{ marginTop: 14 }}>
            {current.map((sim) => (
              <Reveal key={sim.id}>
                <div className={`esim-sim${sim.status === 'active' ? ' is-active' : ''}`}>
                  <span className="esim-qr" aria-hidden="true" />
                  <span>
                    <strong>PUNTA Philippines · {sim.dataGb} GB / {sim.days} days</strong>
                    <span className="muted" style={{ display: 'block', fontSize: 13, marginTop: 4 }}>
                      ICCID {sim.iccid} · purchased {sim.purchasedAt}
                      {sim.refundedAt ? ` · refunded ${sim.refundedAt}` : ''}
                    </span>
                  </span>
                  <span className="esim-side">
                    <span className={`esim-status esim-status--${sim.status === 'ready to activate' ? 'ready' : sim.status}`}>
                      {sim.status}
                    </span>
                    {sim.status === 'ready to activate' &&
                      (refundAskingId === sim.id ? (
                        <span className="esim-confirm" role="alertdialog" aria-label="Confirm refund">
                          <span className="esim-confirm-q">
                            Refund {money(pkgPrice(sim.packageId))}? The QR stops working.
                          </span>
                          <span className="esim-confirm-btns">
                            <button type="button" className="esim-act" onClick={() => setRefundAskingId(null)}>
                              Keep it
                            </button>
                            <button
                              type="button"
                              className="esim-act esim-act--danger"
                              onClick={() => {
                                refund(sim.id)
                                setRefundAskingId(null)
                              }}
                            >
                              Yes, refund
                            </button>
                          </span>
                        </span>
                      ) : (
                        <span className="esim-actions">
                          <button type="button" className="esim-act esim-act--go" onClick={() => activate(sim.id)}>
                            Activate
                          </button>
                          <button type="button" className="esim-act" onClick={() => setRefundAskingId(sim.id)}>
                            Refund
                          </button>
                        </span>
                      ))}
                  </span>
                  {sim.status === 'active' && <UsageBar sim={sim} />}
                </div>
              </Reveal>
            ))}
          </div>

          {refunded.length > 0 && (
            <details className="esim-archive">
              <summary>
                Refunded eSIMs <span className="esim-count">({refunded.length})</span>
              </summary>
              <div className="esim-owned esim-owned--archive">
                {refunded.map((sim) => (
                  <div className="esim-sim esim-sim--archived" key={sim.id}>
                    <span>
                      <strong>PUNTA Philippines · {sim.dataGb} GB / {sim.days} days</strong>
                      <span className="muted esim-archived-meta">
                        ICCID {sim.iccid} · purchased {sim.purchasedAt}
                        {sim.refundedAt ? ` · refunded ${sim.refundedAt}` : ''}
                      </span>
                    </span>
                    <span className="esim-status esim-status--refunded">refunded</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>
      )}
    </div>
  )
}
