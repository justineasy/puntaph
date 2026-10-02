export function peso(n: number): string {
  return `₱${n.toLocaleString('en-PH')}`
}

export function nights(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime()
  const b = new Date(checkOut).getTime()
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function fmtDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function fmtDateRange(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return ''
  const ci = new Date(checkIn)
  const co = new Date(checkOut)
  if (ci.getMonth() === co.getMonth()) {
    return `${fmtDate(checkIn)} – ${co.getDate()}`
  }
  return `${fmtDate(checkIn)} – ${fmtDate(checkOut)}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
