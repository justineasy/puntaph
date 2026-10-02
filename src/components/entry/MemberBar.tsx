import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSession, MEMBER_RATE } from '../../state/SessionContext'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'
import { DemoNotice } from '../system/DemoNotice'
import './memberbar.css'

/**
 * SIGN-IN CONTROL — one component, three homes:
 *   bar     → the pill in the member bar
 *   nav     → a quiet text link in the navbar (appears when the bar is dismissed)
 *   profile → a full button on the Profile page
 * Each instance owns its popover, anchored to itself.
 */
export function SignInControl({
  variant = 'bar',
  label = 'Sign in',
}: {
  variant?: 'bar' | 'nav' | 'profile' | 'checkout'
  label?: string
}) {
  const { signIn } = useSession()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [leaving, setLeaving] = useState(false)
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onDoc)
      document.addEventListener('keydown', onKey)
    }
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const canSubmit = email.includes('@') && email.includes('.')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    signIn(email.trim())
    setLeaving(true)
    window.setTimeout(() => {
      setOpen(false)
      setLeaving(false)
      setEmail('')
    }, reduced ? 250 : 500)
  }

  return (
    <span ref={rootRef} className={`si si--${variant}`}>
      <button
        type="button"
        className={variant === 'profile' ? 'btn btn--primary' : 'si-btn'}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {label}
      </button>

      {open && (
        <div
          className={`si-pop${leaving ? ' is-leaving' : ''}`}
          role="dialog"
          aria-label="Sign in to member rates"
        >
          <p className="si-pop-title">Sign in</p>
          <p className="si-pop-sub">
            Enter your email to switch on member rates for this visit.
          </p>
          <DemoNotice variant="inline" />
          <form onSubmit={submit}>
            <label className="si-field">
              <span className="field-label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@example.com"
                autoComplete="email"
                autoFocus
              />
            </label>
            <button
              type="submit"
              className="btn btn--forest btn--block"
              disabled={!canSubmit}
            >
              {leaving ? 'Switching on…' : `Continue — save ${MEMBER_RATE * 100}%`}
            </button>
          </form>
          <p className="si-fine">
            The {MEMBER_RATE * 100}% member rate applies across the whole site
            the moment you continue.
          </p>
        </div>
      )}
    </span>
  )
}

/**
 * THE MEMBER BAR — slim ribbon at the very top. Dismissible via the X;
 * sign-in survives dismissal through the navbar link.
 */
export function MemberBar() {
  const { member, isMember, signIn, signOut, barDismissed, dismissBar } = useSession()
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const reduced = usePrefersReducedMotion()
  const location = useLocation()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // routing is client-side, so nothing dismisses this popover on its own —
  // it would otherwise hang open over whatever page you land on
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // dismissed → hidden entirely AND the reserved strip collapses; the bar
  // returns when membership changes (sign in/out clears the dismissal)
  useEffect(() => {
    document.documentElement.classList.toggle('mbar-hidden', barDismissed)
    return () => document.documentElement.classList.remove('mbar-hidden')
  }, [barDismissed])

  function handleSignIn(email: string) {
    signIn(email)
    setLeaving(true)
    window.setTimeout(() => {
      setOpen(false)
      setLeaving(false)
    }, reduced ? 250 : 500)
  }

  if (barDismissed) return null

  return (
    <div className="mbar" role="region" aria-label="Member rates">
      <div className="shell mbar-inner">
        {isMember && member ? (
          <p className="mbar-note mbar-note--on">
            <span className="mbar-dot" aria-hidden="true" />
            Member rate is on — you're saving {MEMBER_RATE * 100}% on every
            stay, <strong>{member.name.split(' ')[0]}</strong>
          </p>
        ) : (
          <p className="mbar-note">
            <span className="mbar-dot" aria-hidden="true" />
            Member rates — save {MEMBER_RATE * 100}% on every stay when you
            join free
          </p>
        )}

        <span className="mbar-side">
          {isMember ? (
            <button
              type="button"
              className="mbar-action mbar-action--quiet"
              onClick={signOut}
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              className="mbar-action"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              Sign in
            </button>
          )}
          <button
            type="button"
            className="mbar-close"
            onClick={dismissBar}
            aria-label="Hide the member bar"
            title="Hide"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </span>
      </div>

      {/* bar's own popover lives at the bar level so it anchors cleanly */}
      {open && !isMember && (
        <BarPopover leaving={leaving} onClose={() => setOpen(false)} onSignIn={handleSignIn} />
      )}
    </div>
  )
}

/** Popover variant anchored to the bar's right edge (fixed positioning). */
function BarPopover({
  leaving,
  onSignIn,
}: {
  leaving: boolean
  onClose?: () => void
  onSignIn: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const reduced = usePrefersReducedMotion()
  void reduced
  const canSubmit = email.includes('@') && email.includes('.')

  return (
    <div className={`mbar-pop${leaving ? ' is-leaving' : ''}`} role="dialog" aria-label="Sign in to member rates">
      <p className="mbar-pop-title">Sign in</p>
      <p className="mbar-pop-sub">
        Enter your email to switch on member rates for this visit.
      </p>
      <DemoNotice variant="inline" />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit) onSignIn(email.trim())
        }}
      >
        <label className="mbar-field">
          <span className="field-label">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@example.com"
            autoComplete="email"
            autoFocus
          />
        </label>
        <button
          type="submit"
          className="btn btn--forest btn--block"
          disabled={!canSubmit}
        >
          {leaving ? 'Switching on…' : `Continue — save ${MEMBER_RATE * 100}%`}
        </button>
      </form>
      <p className="mbar-fine">
        The {MEMBER_RATE * 100}% member rate applies across the whole site the
        moment you continue.
      </p>
    </div>
  )
}
