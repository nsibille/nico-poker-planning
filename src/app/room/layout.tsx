import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { I18nProvider } from '@/lib/i18n/I18nProvider'
import { readLocaleFromCookieString, LOCALE_COOKIE } from '@/lib/i18n/locale-cookie'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function RoomLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  const locale = readLocaleFromCookieString(`${LOCALE_COOKIE}=${store.get(LOCALE_COOKIE)?.value ?? ''}`)
  return <I18nProvider initialLocale={locale}>{children}</I18nProvider>
}
