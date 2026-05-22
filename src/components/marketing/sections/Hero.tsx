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
  // Mini-mockup of a reveal scoreboard — pure CSS, no screenshot dependency.
  return (
    <div className="marketing-hero__preview" aria-hidden>
      <div className="hero-preview-card">
        <div className="hero-preview-card__top">
          <div className="hero-preview-card__chip">
            <span style={{ fontSize: 13 }}>🃏</span>
            <span>scrumbler.app/room/<code className="mono-coral">abc-123</code></span>
          </div>
          <div className="hero-preview-card__role">🎯 Scrum Master</div>
        </div>

        <div className="hero-preview-card__story">
          <span className="eyebrow eyebrow--mini">Story</span>
          <h3>Refactor du module d’authentification</h3>
        </div>

        <div className="hero-preview-card__grid">
          {[
            { p: '🦊 Lina', v: '5' },
            { p: '🐼 Tom', v: '8' },
            { p: '🦉 Sam', v: '5' },
            { p: '🦊 Pol', v: '8' },
            { p: '🐙 Jin', v: '13' },
          ].map((row, i) => (
            <div key={i} className="hero-preview-card__row">
              <span className="hero-preview-card__player">{row.p}</span>
              <span className="hero-preview-card__vote">{row.v}</span>
            </div>
          ))}
        </div>

        <div className="hero-preview-card__stats">
          <div>
            <span className="eyebrow eyebrow--mini">Médiane</span>
            <strong>8</strong>
          </div>
          <div>
            <span className="eyebrow eyebrow--mini">Consensus</span>
            <strong>78%</strong>
          </div>
          <div>
            <span className="eyebrow eyebrow--mini">Tier</span>
            <strong className="hero-preview-card__tier">MEDIUM</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
