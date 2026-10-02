/**
 * PUNTA icon set — single-weight strokes, drawn inline.
 * No icon library; the brand keeps its own hand.
 */

const stroke = {
  // A sane default box. An inline SVG with no width or height falls back to
  // its 300×150 default and swallows whatever contains it — which is exactly
  // how the eSIM price tick ate a whole plan card. 1em keeps an unsized icon
  // at text size; any CSS size still wins over these attributes.
  width: '1em',
  height: '1em',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

type IconProps = { className?: string }

export function IconSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true" {...stroke}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  )
}

export function IconHeart({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20.3S4 15.1 4 9.9C4 7.2 6.1 5 8.8 5c1.3 0 2.5.6 3.2 1.6C12.7 5.6 13.9 5 15.2 5 17.9 5 20 7.2 20 9.9c0 5.2-8 10.4-8 10.4z" />
    </svg>
  )
}

export function IconStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="1em" height="1em" fill="currentColor">
      <path d="M12 3.4l2.3 5.2 5.7.5-4.3 3.7 1.3 5.6-5-3-5 3 1.3-5.6L4 9.1l5.7-.5z" />
    </svg>
  )
}

export function IconGuests() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 19c.8-3 3.4-4.6 6.5-4.6s5.7 1.6 6.5 4.6" />
    </svg>
  )
}

export function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10.5h16M8 4v3.5M16 4v3.5" />
    </svg>
  )
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true" {...stroke}>
      <path d="M4 12h15" />
      <path d="M13.5 6.5L19.5 12l-6 5.5" />
    </svg>
  )
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true" {...stroke}>
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  )
}

export function IconPin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 12 4.5 6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10z" />
      <circle cx="12" cy="10.6" r="2.3" />
    </svg>
  )
}

export function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconInfo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11.2v5.2M12 7.9v.01" />
    </svg>
  )
}

export function IconFilter() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  )
}

export function IconUser() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M4.8 19.5c1-3.4 3.9-5.2 7.2-5.2s6.2 1.8 7.2 5.2" />
    </svg>
  )
}

export function IconExplore() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2.2 5-4.8 2 2.2-5z" />
    </svg>
  )
}

export function IconBag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  )
}

export function IconKey() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="8" cy="14" r="3.6" />
      <path d="M11 11.5L19 4M15.5 7.5l2.5 2.5M13 10l2 2" />
    </svg>
  )
}

export function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function IconChat() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4.5 6.8A2.3 2.3 0 0 1 6.8 4.5h10.4a2.3 2.3 0 0 1 2.3 2.3v7.4a2.3 2.3 0 0 1-2.3 2.3H10l-4.5 3.5v-3.5h-.7a2.3 2.3 0 0 1 0-4.6" />
    </svg>
  )
}

export function IconChart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4.5 19.5h15" />
      <path d="M7.5 19.5v-6M12 19.5V8M16.5 19.5v-9.5" />
    </svg>
  )
}

export function IconImage() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 15.5l4.5-4.5 4 4 3-3L20 16" />
      <circle cx="9.2" cy="9.4" r="1.4" />
    </svg>
  )
}

export function IconPeso() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M8 19V5.5h4.2a4 4 0 0 1 0 8H8" />
      <path d="M6.5 9.5h7M6.5 12.5h7" />
    </svg>
  )
}

export function IconClock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.5 2.5" />
    </svg>
  )
}

export function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  )
}
