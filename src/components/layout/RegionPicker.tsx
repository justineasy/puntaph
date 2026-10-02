import { useEffect, useRef, useState } from 'react'
import { useRegion } from '../../state/RegionContext'
import { LANGUAGES } from '../../lib/i18n'
import { CURRENCIES } from '../../lib/currency'
import { IconCheck } from '../system/Icons'
import './regionpicker.css'

/**
 * LANGUAGE & CURRENCY — the globe control. One component, two variants:
 * nav (compact popover) and profile (full section). Selection persists
 * and takes effect instantly across the whole site.
 */
export function RegionPicker({ variant = 'nav' }: { variant?: 'nav' | 'profile' }) {
  const { lang, currency, setLang, setCurrency, t } = useRegion()
  const [open, setOpen] = useState(false)
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

  if (variant === 'profile') {
    return (
      <div className="rp rp--profile" ref={rootRef as React.RefObject<HTMLDivElement>}>
        <div className="rp-section">
          <p className="drawer-title">{t('misc.lang')}</p>
          <div className="rp-rows">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`rp-row${lang === l.code ? ' is-active' : ''}`}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
              >
                <span>
                  <span className="rp-row-main">{l.label}</span>
                  <span className="rp-row-sub">{l.english}</span>
                </span>
                {lang === l.code && <IconCheck />}
              </button>
            ))}
          </div>
        </div>
        <div className="rp-section">
          <p className="drawer-title">{t('misc.currency')}</p>
          <div className="rp-rows">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`rp-row${currency === c.code ? ' is-active' : ''}`}
                onClick={() => setCurrency(c.code)}
                aria-pressed={currency === c.code}
              >
                <span>
                  <span className="rp-row-main">{c.code}</span>
                  <span className="rp-row-sub">{c.label} · {c.symbol}</span>
                </span>
                {currency === c.code && <IconCheck />}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeLang = LANGUAGES.find((l) => l.code === lang)
  const activeCur = CURRENCIES.find((c) => c.code === currency)

  return (
    <span ref={rootRef} className="rp">
      <button
        type="button"
        className="rp-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${t('misc.lang')} & ${t('misc.currency')}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.8 2.6 4.2 5.6 4.2 9S14.8 18.4 12 21c-2.8-2.6-4.2-5.6-4.2-9S9.2 5.6 12 3z" />
        </svg>
        <span className="rp-btn-label">
          {activeLang?.code.toUpperCase()} · {activeCur?.symbol}
        </span>
      </button>

      {open && (
        <div className="rp-pop" role="dialog" aria-label={`${t('misc.lang')} & ${t('misc.currency')}`}>
          <p className="drawer-title">{t('misc.lang')}</p>
          <div className="rp-rows">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`rp-row${lang === l.code ? ' is-active' : ''}`}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
              >
                <span>
                  <span className="rp-row-main">{l.label}</span>
                  <span className="rp-row-sub">{l.english}</span>
                </span>
                {lang === l.code && <IconCheck />}
              </button>
            ))}
          </div>

          <p className="drawer-title rp-cur-title">{t('misc.currency')}</p>
          <div className="rp-rows">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`rp-row${currency === c.code ? ' is-active' : ''}`}
                onClick={() => setCurrency(c.code)}
                aria-pressed={currency === c.code}
              >
                <span>
                  <span className="rp-row-main">{c.code}</span>
                  <span className="rp-row-sub">{c.label} · {c.symbol}</span>
                </span>
                {currency === c.code && <IconCheck />}
              </button>
            ))}
          </div>
        </div>
      )}
    </span>
  )
}
