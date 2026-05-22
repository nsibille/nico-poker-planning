import type { Dictionary } from '@/lib/i18n/dict'

type Props = { dict: Dictionary['how'] }

export function HowItWorks({ dict }: Props) {
  return (
    <section className="marketing-section marketing-how">
      <div className="marketing-section__inner">
        <span className="eyebrow">{dict.eyebrow}</span>
        <h2 className="marketing-section__title">{dict.title}</h2>

        <ol className="marketing-how__steps">
          {dict.steps.map(step => (
            <li key={step.n} className="marketing-how__step">
              <span className="marketing-how__num">{step.n}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
