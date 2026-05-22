import Link from 'next/link'
import type { Dictionary } from '@/lib/i18n/dict'

type Props = { dict: Dictionary['finalCta'] }

export function FinalCTA({ dict }: Props) {
  return (
    <section className="marketing-section marketing-final-cta">
      <div className="marketing-final-cta__card bg-card-pattern bg-card-pattern--bold">
        <div className="marketing-final-cta__deco">
          <div className="deco-blob" style={{ width: 260, height: 220, background: 'var(--color-indigo)', top: -60, right: -40, opacity: 0.55 }} />
          <div className="deco-blob" style={{ width: 200, height: 180, background: 'var(--color-violet)', bottom: -60, left: -40, opacity: 0.45 }} />
        </div>
        <div className="marketing-final-cta__content">
          <h2>{dict.title}</h2>
          <p>{dict.body}</p>
          <Link href="/app" className="btn-primary-md marketing-cta-pill marketing-cta-pill--lg marketing-final-cta__btn">
            {dict.cta} →
          </Link>
        </div>
      </div>
    </section>
  )
}
