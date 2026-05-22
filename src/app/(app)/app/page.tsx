import { LobbyForm } from '@/components/lobby/LobbyForm'

export default function HomePage() {
  return (
    <div className="layout-lobby">
      {/* Éléments décoratifs (deco-blob, deco-circle) */}
      <div
        className="deco-blob"
        style={{
          width: '320px',
          height: '260px',
          background: 'var(--color-teal)',
          top: '-60px',
          right: '-80px',
        }}
      />
      <div
        className="deco-blob"
        style={{
          width: '200px',
          height: '180px',
          background: 'var(--color-violet)',
          bottom: '40px',
          left: '-60px',
        }}
      />
      <div
        className="deco-circle"
        style={{
          width: '140px',
          height: '140px',
          color: 'var(--color-amber)',
          bottom: '120px',
          right: '60px',
        }}
      />
      <div
        className="deco-circle"
        style={{
          width: '80px',
          height: '80px',
          color: 'var(--color-sky)',
          top: '80px',
          left: '80px',
        }}
      />

      <div className="layout-lobby-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🃏</div>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--color-text-primary)',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            Sprint Poker
          </h1>
          <p style={{
            fontSize: 'var(--text-md)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 'var(--fw-normal)',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            Estimez vos stories en temps réel
          </p>
        </div>

        {/* Card formulaire */}
        <div className="card-surface">
          <LobbyForm />
        </div>

        {/* Footer discret */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-primary)',
        }}>
          Aucun compte requis, connexion anonyme
        </p>
      </div>
    </div>
  )
}
