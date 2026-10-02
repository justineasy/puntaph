import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { translate, type Lang } from '../lib/i18n'
import {
  formatMoney,
  currencyMeta,
  type Currency,
} from '../lib/currency'

const LANG_KEY = 'punta.lang.v1'
const CUR_KEY = 'punta.currency.v1'

interface RegionState {
  lang: Lang
  currency: Currency
  setLang: (l: Lang) => void
  setCurrency: (c: Currency) => void
  /** Translate an interface key with English fallback. */
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Format a PHP amount in the selected currency. */
  money: (pesoAmount: number) => string
  /** The selected currency's metadata. */
  cur: ReturnType<typeof currencyMeta>
}

const RegionContext = createContext<RegionState | null>(null)

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'en' || v === 'fil' || v === 'ko' || v === 'ja') return v
  } catch { /* fall through */ }
  return 'en'
}

function loadCur(): Currency {
  try {
    const v = localStorage.getItem(CUR_KEY)
    if (v === 'PHP' || v === 'USD' || v === 'EUR' || v === 'JPY' || v === 'KRW' || v === 'AUD') {
      return v
    }
  } catch { /* fall through */ }
  return 'PHP'
}

export function RegionProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang)
  const [currency, setCurrencyState] = useState<Currency>(loadCur)

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang)
      document.documentElement.lang = lang === 'fil' ? 'fil-PH' : lang
    } catch { /* in-memory only */ }
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem(CUR_KEY, currency)
    } catch { /* in-memory only */ }
  }, [currency])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), [])

  const value = useMemo<RegionState>(
    () => ({
      lang,
      currency,
      setLang,
      setCurrency,
      t: (key, vars) => translate(lang, key, vars),
      money: (pesoAmount) => formatMoney(pesoAmount, currency),
      cur: currencyMeta(currency),
    }),
    [lang, currency, setLang, setCurrency],
  )

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion(): RegionState {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within RegionProvider')
  return ctx
}
