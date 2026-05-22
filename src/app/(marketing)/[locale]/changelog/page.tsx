import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n/dict'
import { isLocale } from '@/lib/i18n/locales'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return {
    title: locale === 'fr' ? 'Changelog' : 'Changelog',
    description: dict.changelog.lead,
    alternates: { canonical: `/${locale}/changelog`, languages: { fr: '/fr/changelog', en: '/en/changelog' } },
  }
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale).changelog

  return (
    <section className="marketing-section marketing-changelog">
      <div className="marketing-section__inner marketing-changelog__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h1 className="marketing-section__title marketing-section__title--lg">{dict.title}</h1>
        <p className="marketing-section__lead">{dict.lead}</p>

        <ol className="marketing-changelog__entries">
          {dict.entries.map(entry => (
            <li key={entry.version} className="marketing-changelog__entry">
              <div className="marketing-changelog__meta">
                <code className="marketing-changelog__version">v{entry.version}</code>
                <time className="marketing-changelog__date">{entry.date}</time>
              </div>
              <h3>{entry.title}</h3>
              <ul>
                {entry.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
