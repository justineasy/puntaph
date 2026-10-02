/**
 * CURRENCY — display conversion with the peso as the source of truth.
 * All prices in the data layer are PHP; every displayed amount converts
 * through here so the member rate and currency never disagree.
 */

export type Currency = 'PHP' | 'USD' | 'EUR' | 'JPY' | 'KRW' | 'AUD'

export const CURRENCIES: {
  code: Currency
  label: string
  symbol: string
  /** How many units of this currency one PHP buys (indicative, fixed for the prototype). */
  phpTo: number
  /** Decimals used for this currency's display. */
  decimals: number
}[] = [
  { code: 'PHP', label: 'Philippine peso', symbol: '₱', phpTo: 1, decimals: 0 },
  { code: 'USD', label: 'US dollar', symbol: '$', phpTo: 0.0177, decimals: 0 },
  { code: 'EUR', label: 'Euro', symbol: '€', phpTo: 0.0163, decimals: 0 },
  { code: 'JPY', label: 'Japanese yen', symbol: '¥', phpTo: 2.66, decimals: 0 },
  { code: 'KRW', label: 'South Korean won', symbol: '₩', phpTo: 24.4, decimals: 0 },
  { code: 'AUD', label: 'Australian dollar', symbol: 'A$', phpTo: 0.0269, decimals: 0 },
]

export function currencyMeta(code: Currency) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

/** Convert a PHP amount into the target currency's major units. */
export function convert(pesoAmount: number, code: Currency): number {
  const meta = currencyMeta(code)
  const value = pesoAmount * meta.phpTo
  return Math.round(value) // whole units — booking products rarely show cents
}

/** Format a PHP amount for display in the target currency. */
export function formatMoney(pesoAmount: number, code: Currency): string {
  const meta = currencyMeta(code)
  return `${meta.symbol}${convert(pesoAmount, code).toLocaleString('en-US')}`
}
