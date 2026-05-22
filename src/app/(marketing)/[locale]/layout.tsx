import { notFound } from 'next/navigation'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { getDictionary } from '@/lib/i18n/dict'
import { isLocale, locales, type Locale } from '@/lib/i18n/locales'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr'

  return (
    <div className="marketing-shell">
      <Header locale={locale} dict={dict.nav} otherLocale={otherLocale} />
      <main className="marketing-main">{children}</main>
      <Footer locale={locale} dict={dict.footer} />
    </div>
  )
}
