import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n/dict'
import { isLocale, locales } from '@/lib/i18n/locales'

const legalSlugs = ['privacy', 'terms', 'cookies'] as const
type LegalSlug = (typeof legalSlugs)[number]

function isLegalSlug(s: string): s is LegalSlug {
  return (legalSlugs as readonly string[]).includes(s)
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap(locale =>
    legalSlugs.map(slug => ({ locale, slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale) || !isLegalSlug(slug)) return {}
  const content = getDictionary(locale).legal[slug]
  return {
    title: content.title,
    description: content.updated,
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: {
        fr: `/fr/legal/${slug}`,
        en: `/en/legal/${slug}`,
      },
    },
  }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale) || !isLegalSlug(slug)) notFound()
  const content = getDictionary(locale).legal[slug]

  return (
    <section className="marketing-section marketing-legal">
      <div className="marketing-section__inner marketing-legal__inner">
        <h1 className="marketing-section__title marketing-section__title--lg">{content.title}</h1>
        <p className="marketing-legal__updated">{content.updated}</p>

        <div className="marketing-legal__body">
          {content.body.map((block, i) => (
            <section key={i}>
              <h2>{block.h}</h2>
              <p>{block.p}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
