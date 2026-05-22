import type { Dictionary } from '@/lib/i18n/dict'

type Props = { dict: Dictionary['problem'] }

export function ProblemSolution({ dict }: Props) {
  return (
    <section className="marketing-section marketing-problem">
      <div className="marketing-section__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h2 className="marketing-section__title">{dict.title}</h2>

        <div className="marketing-problem__grid">
          {dict.items.map((item, i) => (
            <article key={i} className="marketing-problem__card">
              <div className="marketing-problem__num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
