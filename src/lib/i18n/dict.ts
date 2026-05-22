import { fr } from './dictionaries/fr'
import { en } from './dictionaries/en'
import type { Locale } from './locales'

export type Dictionary = typeof fr

const dictionaries: Record<Locale, Dictionary> = {
  fr,
  en: en as unknown as Dictionary,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
