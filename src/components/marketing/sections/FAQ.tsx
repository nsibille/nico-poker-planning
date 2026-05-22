import type { Dictionary } from '@/lib/i18n/dict'

type Props = { dict: Dictionary['faq'] }

export function FAQ({ dict }: Props) {
  return (
    <section className="marketing-section marketing-faq">
      <div className="marketing-section__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h2 className="marketing-section__title">{dict.title}</h2>

        <div className="marketing-faq__list">
          {dict.items.map((item, i) => (
            <details key={i} className="marketing-faq__item">
              <summary>
                <span>{item.q}</span>
                <span className="marketing-faq__chev" aria-hidden>+</span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
