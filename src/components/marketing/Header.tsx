'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Lockup } from './Lockup'
import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dict'

type Props = {
  locale: Locale
  dict: Dictionary['nav']
  otherLocale: Locale
}

export function Header({ locale, dict, otherLocale }: Props) {
  const [open, setOpen] = useState(false)
  const base = `/${locale}`

  return (
    <header className="marketing-header">
      <div className="marketing-header__inner">
        <Lockup locale={locale} size={32} />

        <nav className="marketing-header__nav" aria-label="Primary">
          <Link className="marketing-nav-link" href={`${base}#features`}>
            {dict.product}
          </Link>
          <Link className="marketing-nav-link" href={`${base}/pricing`}>
            {dict.pricing}
          </Link>
          <Link className="marketing-nav-link" href={`${base}/changelog`}>
            {dict.changelog}
          </Link>
        </nav>

        <div className="marketing-header__actions">
          <Link
            href={`/${otherLocale}`}
            className="marketing-lang-switch"
            aria-label={`Switch to ${otherLocale.toUpperCase()}`}
          >
            {otherLocale.toUpperCase()}
          </Link>
          <Link href="/app" className="btn-primary-md marketing-cta-pill">
            {dict.cta} →
          </Link>
        </div>

        <button
          type="button"
          className="marketing-header__burger"
          aria-expanded={open}
          aria-label={open ? dict.closeMenu : dict.openMenu}
          onClick={() => setOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="marketing-header__mobile">
          <Link className="marketing-nav-link" href={`${base}#features`} onClick={() => setOpen(false)}>
            {dict.product}
          </Link>
          <Link className="marketing-nav-link" href={`${base}/pricing`} onClick={() => setOpen(false)}>
            {dict.pricing}
          </Link>
          <Link className="marketing-nav-link" href={`${base}/changelog`} onClick={() => setOpen(false)}>
            {dict.changelog}
          </Link>
          <Link href={`/${otherLocale}`} className="marketing-nav-link" onClick={() => setOpen(false)}>
            {otherLocale.toUpperCase()}
          </Link>
          <Link href="/app" className="btn-primary-md marketing-cta-pill" onClick={() => setOpen(false)}>
            {dict.cta} →
          </Link>
        </div>
      )}
    </header>
  )
}
