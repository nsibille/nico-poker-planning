import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dict'

type Props = {
  locale: Locale
  dict: Dictionary['hero']
}

export function Hero({ locale, dict }: Props) {
  return (
    <section className="marketing-hero">
      <div className="marketing-hero__deco">
        <div className="deco-blob" style={{ width: 380, height: 320, background: 'var(--color-teal)', top: -80, right: -120 }} />
        <div className="deco-blob" style={{ width: 240, height: 220, background: 'var(--color-violet)', top: 240, left: -100 }} />
        <div className="deco-circle" style={{ width: 120, height: 120, color: 'var(--color-amber)', bottom: 80, right: 80 }} />
        <div className="deco-circle" style={{ width: 70, height: 70, color: 'var(--color-sky)', top: 140, left: 80 }} />
      </div>

      <div className="marketing-hero__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h1 className="marketing-hero__title">{dict.title}</h1>
        <p className="marketing-hero__lead">{dict.lead}</p>

        <div className="marketing-hero__ctas">
          <Link href="/app" className="btn-primary-md marketing-cta-pill marketing-cta-pill--lg">
            {dict.ctaPrimary} →
          </Link>
          <Link href={`/${locale}#features`} className="btn-secondary-md marketing-cta-pill marketing-cta-pill--lg">
            {dict.ctaSecondary}
          </Link>
        </div>

        <p className="marketing-hero__proof">{dict.proof}</p>
      </div>

      <HeroPreview />
    </section>
  )
}

function HeroPreview() {
  return (
    <div className="marketing-hero__preview" aria-hidden>
      <iframe
        src="/scrumbler-loop.html"
        title="Démo Scrumbler en boucle"
        loading="lazy"
        className="hero-preview-frame"
      />
    </div>
  )
}
