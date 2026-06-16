import { defaultLocale, isLocale, type Locale } from './locales'

// Cookie partagé entre le site marketing (routes /[locale]) et l'app non
// localisée (/app, /room/[roomId]). Il assure la continuité de langue d'un bout
// à l'autre du parcours. Volontairement hors de l'URL de la salle pour qu'un
// lien partagé s'ouvre dans la langue de chaque personne, pas celle du créateur.
export const LOCALE_COOKIE = 'scrumbler_locale'
// Un an, la préférence de langue n'a pas de raison d'expirer plus tôt.
const ONE_YEAR = 60 * 60 * 24 * 365

/** Parse une chaîne de cookies (document.cookie ou header) et renvoie la locale. */
export function readLocaleFromCookieString(raw: string | null | undefined): Locale {
  if (!raw) return defaultLocale
  for (const part of raw.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === LOCALE_COOKIE) {
      const value = decodeURIComponent(rest.join('='))
      if (isLocale(value)) return value
    }
  }
  return defaultLocale
}

/** Lecture côté client (navigateur). */
export function getLocaleCookie(): Locale {
  if (typeof document === 'undefined') return defaultLocale
  return readLocaleFromCookieString(document.cookie)
}

/** Écriture côté client. Persiste la préférence pour les prochaines visites. */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`
}
