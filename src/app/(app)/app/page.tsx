import { Suspense } from 'react'
import { LobbyForm } from '@/components/lobby/LobbyForm'
import { LobbyShell } from '@/components/lobby/LobbyShell'

export default function HomePage() {
  return (
    <LobbyShell>
      <Suspense fallback={null}>
        <LobbyForm />
      </Suspense>
    </LobbyShell>
  )
}
