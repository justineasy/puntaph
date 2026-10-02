import { useState, type ReactNode } from 'react'
import './paymentpartners.css'

/**
 * Payment partners — simplified, hand-set SVG marks (no image assets, no
 * icon libraries). Brand-adjacent colors on white tiles, the way trust
 * strips read on Philippine checkout pages.
 */

interface Mark {
  name: string
  el: ReactNode
}

const MARKS: Mark[] = [
  {
    name: 'Visa',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <text
          x="32"
          y="18"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="800"
          fontStyle="italic"
          letterSpacing="0.5"
          fill="#1a1f71"
        >
          VISA
        </text>
      </svg>
    ),
  },
  {
    name: 'Mastercard',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <circle cx="26.5" cy="12" r="9" fill="#eb001b" />
        <circle cx="37.5" cy="12" r="9" fill="#f79e1b" opacity="0.92" />
      </svg>
    ),
  },
  {
    name: 'GCash',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <rect x="11" y="2" width="20" height="20" rx="6" fill="#0075f6" />
        <text
          x="21"
          y="17"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="#ffffff"
        >
          G
        </text>
        <text
          x="43"
          y="17"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="12.5"
          fontWeight="800"
          fill="#0075f6"
        >
          Cash
        </text>
      </svg>
    ),
  },
  {
    name: 'Maya',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <rect x="11" y="2" width="20" height="20" rx="6" fill="#0bd56e" />
        <text
          x="21"
          y="16.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="#ffffff"
        >
          m
        </text>
        <text
          x="42"
          y="16.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="12.5"
          fontWeight="700"
          fill="#10241a"
        >
          maya
        </text>
      </svg>
    ),
  },
  {
    name: '7-Eleven',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <text
          x="26"
          y="18.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="18"
          fontWeight="800"
          fill="#ee7623"
        >
          7
        </text>
        <rect x="34" y="8.5" width="9" height="3" fill="#008061" />
        <rect x="34" y="13.5" width="9" height="3" fill="#ee7623" />
      </svg>
    ),
  },
  {
    name: 'Coins.ph',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <text
          x="32"
          y="16.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="12.5"
          fontWeight="600"
          fill="#00b0e6"
        >
          coins.ph
        </text>
      </svg>
    ),
  },
  {
    name: 'BDO',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <text
          x="32"
          y="17.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="15"
          fontWeight="800"
          letterSpacing="1"
          fill="#003da5"
        >
          BDO
        </text>
      </svg>
    ),
  },
  {
    name: 'BPI',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <path d="M15 12l4.5-6 4.5 6-4.5 6z" fill="#f5a800" />
        <text
          x="40"
          y="17.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="14"
          fontWeight="800"
          letterSpacing="0.5"
          fill="#003da5"
        >
          BPI
        </text>
      </svg>
    ),
  },
  {
    name: 'SSS',
    el: (
      <svg viewBox="0 0 64 24" aria-hidden="true">
        <text
          x="32"
          y="17.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="15"
          fontWeight="800"
          letterSpacing="1.5"
          fill="#00703c"
        >
          SSS
        </text>
        <rect x="20" y="20" width="24" height="2" fill="#0066b3" />
      </svg>
    ),
  },
]

const FAQ: { method: string; text: string }[] = [
  {
    method: 'GCash',
    text: 'Pay from your wallet in two taps — you confirm in the GCash app and your booking is instant.',
  },
  {
    method: 'Maya',
    text: 'Same idea, different wallet. Confirm in Maya and the reservation locks in immediately.',
  },
  {
    method: 'Credit / Debit Card',
    text: 'Visa or Mastercard over an encrypted connection. PUNTA never sees or stores your card number.',
  },
  {
    method: 'Bank Transfer',
    text: 'BDO or BPI via InstaPay / PESONet. Your dates are held for 24 hours while the transfer clears.',
  },
  {
    method: 'Over the counter',
    text: 'Any 7-Eleven, Coins.ph, or SSS branch — show your booking code, pay cash, done.',
  },
]

export function PaymentPartners({ compact = false, faq = false }: { compact?: boolean; faq?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`pay-strip${compact ? ' pay-strip--compact' : ''}`}>
      <p className="pay-strip-head">Payment partners</p>
      <ul className="pay-tiles">
        {MARKS.map((m) => (
          <li key={m.name} className="pay-tile" title={m.name}>
            {m.el}
            <span className="sr-only">{m.name}</span>
          </li>
        ))}
      </ul>

      {faq && (
        <div className="pay-faq">
          <button
            type="button"
            className="pay-faq-toggle"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            How each payment works <span aria-hidden="true">{open ? '↑' : '↓'}</span>
          </button>
          {open && (
            <dl className="pay-faq-list">
              {FAQ.map((f) => (
                <div key={f.method} className="pay-faq-row">
                  <dt>{f.method}</dt>
                  <dd>{f.text}</dd>
                </div>
              ))}
              <p className="pay-faq-note">Payments on PUNTA are simulated in this prototype — nothing is ever charged.</p>
            </dl>
          )}
        </div>
      )}
    </div>
  )
}
