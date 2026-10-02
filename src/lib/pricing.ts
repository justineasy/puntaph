import type { Stay } from '../types'

/**
 * THE PRICING LAYER — every peso shown on the site passes through here,
 * so the member rate is real money everywhere, not just a claim in the bar.
 */
export function nightly(stay: Stay, multiplier: number): number {
  return Math.round(stay.price * multiplier)
}

export interface Quote {
  nightlyRate: number
  nights: number
  subtotal: number
  cleaning: number
  serviceFee: number
  total: number
}

export function quote(
  stay: Stay,
  multiplier: number,
  nights: number,
): Quote {
  const nightlyRate = nightly(stay, multiplier)
  const n = Math.max(1, nights)
  const subtotal = nightlyRate * n
  const cleaning = Math.round(stay.price * 0.12 * multiplier)
  const serviceFee = Math.round(subtotal * 0.08)
  return {
    nightlyRate,
    nights: n,
    subtotal,
    cleaning,
    serviceFee,
    total: subtotal + cleaning + serviceFee,
  }
}
