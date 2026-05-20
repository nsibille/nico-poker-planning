'use client'
import { useRouter } from 'next/navigation'
import { BadgeRoomId, BadgeRound, BadgePhase } from '@/components/ui/Badge'
import type { Room } from '@/types'

interface RoomHeaderProps {
  room: Room
  connected: boolean
}

export function RoomHeader({ room, connected }: RoomHeaderProps) {
  const router = useRouter()

  return (
    <nav className="nav-room-header">
      <div className="flex items-center gap-2 flex-1">
        <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--color-brand-primary)', fontFamily: 'var(--font-primary)' }}>
          🃏
        </span>
        <h2>Sprint Poker</h2>
        <BadgeRoomId id={room.id} />
        <BadgeRound round={room.round} />
        <BadgePhase phase={room.phase as 'waiting' | 'voting' | 'revealed'} />
        {!connected && (
          <span
            className="badge-phase-waiting"
            style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning-dark)' }}
          >
            Reconnexion…
          </span>
        )}
      </div>
      <button
        onClick={() => router.push('/')}
        className="btn-ghost-sm"
      >
        Quitter
      </button>
    </nav>
  )
}
