import type { ReactNode } from 'react'
import { IconInfo } from './Icons'
import './demonotice.css'

/**
 * DEMO NOTICE — one honest line, repeated wherever a visitor types
 * something personal: sign-in, an eSIM purchase, checkout, the
 * confirmation step.
 *
 * This build has no server. Everything is kept in this browser's
 * localStorage and nothing is ever transmitted, so a real email typed
 * here is a real email parked in a prototype. "Use a fake one" is both
 * the truthful instruction and the safe default.
 *
 * `block` is the boxed form for a panel with fields under it; `inline` is
 * the single line for a popover, a toolbar, or beside a button.
 */
export function DemoNotice({
  variant = 'block',
  children,
}: {
  variant?: 'block' | 'inline'
  children?: ReactNode
}) {
  return (
    <p className={`demo-note demo-note--${variant}`}>
      <IconInfo className="demo-note-icon" />
      <span>
        {children ?? (
          <>
            <strong>Please use a fake email.</strong> This is a demo — nothing
            is charged, nothing is sent anywhere, and everything stays in this
            browser.
          </>
        )}
      </span>
    </p>
  )
}
