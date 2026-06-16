'use client'
import { Suspense } from 'react'
import Image from 'next/image'
import { AppHeader } from '@/components/app/AppHeader'
import { LobbyForm } from '@/components/lobby/LobbyForm'
import { Spinner } from '@/components/ui/Spinner'
import { useI18n } from '@/lib/i18n/I18nProvider'

export default function HomePage() {
  const { dict } = useI18n()
  const t = dict.app

  return (
    <div className="layout-lobby">
      <AppHeader />

      <section className="lobby-hero bg-card-pattern" aria-label="Scrumbler">
        <div className="lobby-hero__inner">
          <Image
            src="/brand/logo/logo-horizontal-dark.svg"
            alt="Scrumbler"
            width={357}
            height={94}
            priority
            style={{ height: 72, width: 'auto' }}
          />
          <span className="lobby-hero__eyebrow">{t.hero.eyebrow}</span>
          <p className="lobby-hero__tagline">{t.hero.tagline}</p>
        </div>
      </section>

      <div className="layout-lobby-inner">
        <div className="deco-blob" style={{ width: 220, height: 180, background: 'var(--color-teal)', top: 40, right: -80 }} />
        <div className="deco-blob" style={{ width: 160, height: 140, background: 'var(--color-violet)', bottom: 80, left: -50 }} />
        <div className="deco-circle" style={{ width: 90, height: 90, color: 'var(--color-amber)', bottom: 60, right: 40 }} />

        <div className="card-surface card-surface--elevated">
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><Spinner /></div>}>
            <LobbyForm />
          </Suspense>
        </div>

        <p className="lobby-footnote">{t.hero.footnote}</p>
      </div>
    </div>
  )
}
