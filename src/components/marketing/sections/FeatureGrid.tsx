import type { Dictionary } from '@/lib/i18n/dict'

type Props = { dict: Dictionary['features'] }

export function FeatureGrid({ dict }: Props) {
  return (
    <section id="features" className="marketing-section marketing-features">
      <div className="marketing-section__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h2 className="marketing-section__title">{dict.title}</h2>

        <div className="marketing-features__grid">
          {dict.items.map((item, i) => (
            <article key={i} className="marketing-feature-card">
              <div className="marketing-feature-card__emoji" aria-hidden>{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
