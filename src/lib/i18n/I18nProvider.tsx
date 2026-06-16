'use client'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getDictionary, type Dictionary } from './dict'
import { setLocaleCookie } from './locale-cookie'
import type { Locale } from './locales'

interface I18nContextValue {
  locale: Locale
  dict: Dictionary
  /** Bascule la langue de l'app (lobby + salle). Persiste dans le cookie et
   *  rerend tous les composants, sans navigation. */
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    setLocaleCookie(next)
  }, [])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dict: getDictionary(locale), setLocale }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n doit être utilisé dans un <I18nProvider>')
  }
  return ctx
}
