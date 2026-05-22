import type { Metadata } from 'next'
import Link from 'next/link'
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
    title: locale === 'fr' ? 'Tarifs' : 'Pricing',
    description: dict.pricing.lead,
    alternates: { canonical: `/${locale}/pricing`, languages: { fr: '/fr/pricing', en: '/en/pricing' } },
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale).pricing

  return (
    <section className="marketing-section marketing-pricing">
      <div className="marketing-section__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h1 className="marketing-section__title marketing-section__title--lg">{dict.title}</h1>
        <p className="marketing-section__lead">{dict.lead}</p>

        <div className="marketing-pricing__grid">
          {dict.plans.map(plan => (
            <article
              key={plan.name}
              className={`marketing-plan-card ${plan.highlight ? 'marketing-plan-card--highlight' : ''}`}
            >
              <header className="marketing-plan-card__header">
                <h3>{plan.name}</h3>
                <div className="marketing-plan-card__price">
                  <strong>{plan.price}</strong>
                  {plan.cadence && <span>{plan.cadence}</span>}
                </div>
                <p className="marketing-plan-card__desc">{plan.description}</p>
              </header>

              <ul className="marketing-plan-card__features">
                {plan.features.map(f => (
                  <li key={f}>
                    <span aria-hidden>✓</span> {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={
                  plan.highlight
                    ? 'btn-primary-md marketing-cta-pill marketing-plan-card__cta'
                    : 'btn-secondary-md marketing-cta-pill marketing-plan-card__cta'
                }
              >
                {plan.cta} →
              </Link>
            </article>
          ))}
        </div>

        <p className="marketing-pricing__note">{dict.note}</p>
      </div>
    </section>
  )
}
