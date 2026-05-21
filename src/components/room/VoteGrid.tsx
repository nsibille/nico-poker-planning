'use client'
import { useState } from 'react'
import { VoteCard } from './VoteCard'
import { createClient } from '@/lib/supabase/client'
import { FIBONACCI } from '@/lib/game/constants'
import { useGameStore } from '@/store/gameStore'
import { Toast, useToast } from '@/components/ui/Toast'
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
  const { toast, showToast, clearToast } = useToast()
  const [confirmedVote, setConfirmedVote] = useState<string | null>(null)

  const disabled = myRole !== 'developer' || phase !== 'voting'

  async function handleVote(value: string) {
    if (disabled || !myPlayerId) return
    setSelectedVote(value)
    setConfirmedVote(null)
    const supabase = createClient()
    const { error } = await supabase.from('votes').upsert(
      { room_id: roomId, player_id: myPlayerId, round, value },
      { onConflict: 'room_id,player_id,round' }
    )
    if (error) {
      showToast(`Vote non enregistré : ${error.message}`)
      setSelectedVote(null)
      return
    }
    setConfirmedVote(value)
  }

  if (myRole !== 'developer') return null

  const displayConfirmed = confirmedVote ?? (currentVote && phase === 'voting' ? currentVote : null)

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
      {phase === 'voting' && displayConfirmed && (
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontFamily: 'var(--font-primary)', fontWeight: 'var(--fw-medium)' }}>
          ✓ Vote enregistré : {displayConfirmed}
        </p>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
