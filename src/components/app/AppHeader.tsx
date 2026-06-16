'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/I18nProvider'
import type { Locale } from '@/lib/i18n/locales'

// Header léger partagé par le lobby et la salle de jeu. Logo (retour home dans
// la langue courante) + sélecteur de langue qui agit sur toute l'app via le
// cookie, sans navigation. Les enfants permettent d'injecter des contrôles
// spécifiques à la salle (badges, bouton Quitter).
export function AppHeader({ children }: { children?: React.ReactNode }) {
  const { locale, setLocale } = useI18n()
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr'

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link href={`/${locale}`} aria-label="Scrumbler" className="app-header__lockup">
          <Image
            src="/brand/logo/logo-horizontal.svg"
            alt="Scrumbler"
            width={140}
            height={32}
            priority
            style={{ height: 28, width: 'auto' }}
          />
        </Link>

        {children && <div className="app-header__center">{children}</div>}

        <div className="app-header__actions">
          <button
            type="button"
            className="marketing-lang-switch"
            onClick={() => setLocale(otherLocale)}
            aria-label={`Switch to ${otherLocale.toUpperCase()}`}
          >
            {otherLocale.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  )
}
