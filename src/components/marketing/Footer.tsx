import Link from 'next/link'
import { Lockup } from './Lockup'
import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dict'

type Props = {
  locale: Locale
  dict: Dictionary['footer']
}

export function Footer({ locale, dict }: Props) {
  const base = `/${locale}`
  return (
    <footer className="marketing-footer bg-card-pattern">
      <div className="marketing-footer__inner">
        <div className="marketing-footer__brand">
          <Lockup locale={locale} size={36} theme="dark" />
          <p className="marketing-footer__tagline">{dict.tagline}</p>
        </div>

        <div className="marketing-footer__cols">
          <div className="marketing-footer__col">
            <h4 className="marketing-footer__col-title">{dict.columns.product.title}</h4>
            <ul>
              {dict.columns.product.links.map(l => (
                <li key={l.href}>
                  <Link href={`${base}${l.href}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="marketing-footer__col">
            <h4 className="marketing-footer__col-title">{dict.columns.legal.title}</h4>
            <ul>
              {dict.columns.legal.links.map(l => (
                <li key={l.href}>
                  <Link href={`${base}${l.href}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="marketing-footer__bottom">
        <span>{dict.rights}</span>
        <a className="marketing-footer__mail" href="mailto:hello@scrumbler.app">
          hello@scrumbler.app
        </a>
      </div>
    </footer>
  )
}
