import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dict'

type Props = {
  locale: Locale
  dict: Dictionary['pricingTeaser']
}

export function PricingTeaser({ locale, dict }: Props) {
  return (
    <section className="marketing-section marketing-pricing-teaser">
      <div className="marketing-section__inner marketing-pricing-teaser__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h2 className="marketing-section__title">{dict.title}</h2>
        <p className="marketing-pricing-teaser__body">{dict.body}</p>
        <Link href={`/${locale}/pricing`} className="btn-secondary-md marketing-cta-pill">
          {dict.cta} →
        </Link>
      </div>
    </section>
  )
}
