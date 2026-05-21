'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeRoomId, BadgeRound, BadgePhase } from '@/components/ui/Badge'
import { useGameStore } from '@/store/gameStore'
import { createClient } from '@/lib/supabase/client'
import type { Room } from '@/types'

interface RoomHeaderProps {
  room: Room
  connected: boolean
}

export function RoomHeader({ room, connected }: RoomHeaderProps) {
  const router = useRouter()
  const { myPlayerId, reset } = useGameStore()
  const [leaving, setLeaving] = useState(false)

  const handleLeave = async () => {
    if (leaving) return
    setLeaving(true)
    if (myPlayerId) {
      const supabase = createClient()
      // Best-effort delete — even if it fails (offline, RLS), we still clear the
      // local session so the user lands on a fresh lobby.
      await supabase.from('players').delete().eq('id', myPlayerId).then(() => {}, () => {})
    }
    reset()
    router.push('/')
  }

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
        onClick={handleLeave}
        disabled={leaving}
        className="btn-ghost-sm"
      >
        {leaving ? 'Déconnexion…' : 'Quitter'}
      </button>
    </nav>
  )
}
