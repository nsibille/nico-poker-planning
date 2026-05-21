'use client'
import { VoteCard } from './VoteCard'
import { createClient } from '@/lib/supabase/client'
import { FIBONACCI } from '@/lib/game/constants'
import { useGameStore } from '@/store/gameStore'
import type { Phase } from '@/types'

interface VoteGridProps {
  roomId: string
  round: number
  phase: Phase
  myPlayerId: string | null
  myRole: 'developer' | 'scrum-master' | null
  currentVote: string | null
}

export function VoteGrid({ roomId, round, phase, myPlayerId, myRole, currentVote }: VoteGridProps) {
  const { setSelectedVote } = useGameStore()

  const disabled = myRole !== 'developer' || phase !== 'voting'

  function handleVote(value: string) {
    if (disabled || !myPlayerId) return
    setSelectedVote(value)
    const supabase = createClient()
    void supabase.from('votes').upsert(
      { room_id: roomId, player_id: myPlayerId, round, value },
      { onConflict: 'room_id,player_id,round' }
    )
  }

  if (myRole !== 'developer') return null

  return (
    <div className="card-surface flex flex-col gap-4">
      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
        {phase === 'voting' ? 'Votre estimation' : phase === 'revealed' ? 'Votes révélés' : 'En attente…'}
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {FIBONACCI.map(val => (
          <VoteCard
            key={val}
            value={val}
            selected={currentVote === val}
            disabled={disabled}
            onClick={() => handleVote(val)}
          />
        ))}
      </div>
      {phase === 'voting' && currentVote && (
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontFamily: 'var(--font-primary)', fontWeight: 'var(--fw-medium)' }}>
          ✓ Vote enregistré : {currentVote}
        </p>
      )}
    </div>
  )
}
