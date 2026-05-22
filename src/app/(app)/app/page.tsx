import Image from 'next/image'
import { LobbyForm } from '@/components/lobby/LobbyForm'

export default function HomePage() {
  return (
    <div className="layout-lobby">
      <section className="lobby-hero bg-card-pattern" aria-label="Scrumbler">
        <div className="lobby-hero__inner">
          <Image
            src="/brand/logo/logo-horizontal-dark.svg"
            alt="Scrumbler"
            width={196}
            height={48}
            priority
            style={{ height: 44, width: 'auto' }}
          />
          <span className="lobby-hero__eyebrow">Planning poker</span>
          <p className="lobby-hero__tagline">
            Estime tes user stories en équipe, sans compte, en se prenant au jeu.
          </p>
        </div>
      </section>

      <div className="layout-lobby-inner">
        <div className="deco-blob" style={{ width: 220, height: 180, background: 'var(--color-teal)', top: 40, right: -80 }} />
        <div className="deco-blob" style={{ width: 160, height: 140, background: 'var(--color-violet)', bottom: 80, left: -50 }} />
        <div className="deco-circle" style={{ width: 90, height: 90, color: 'var(--color-amber)', bottom: 60, right: 40 }} />

        <div className="card-surface card-surface--elevated">
          <LobbyForm />
        </div>

        <p className="lobby-footnote">
          Aucun compte requis, connexion anonyme.
        </p>
      </div>
    </div>
  )
}
