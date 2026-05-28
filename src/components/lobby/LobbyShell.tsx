// Coque visuelle partagée entre /app (LobbyForm) et /room/[id] sans session
// (JoinRoomForm) : card centrée sur bg-page, identique des deux côtés.
export function LobbyShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-page)',
        padding: 'var(--space-4)',
      }}
    >
      <div className="card-surface card-surface--elevated" style={{ width: '100%', maxWidth: 460 }}>
        {children}
      </div>
    </div>
  )
}
