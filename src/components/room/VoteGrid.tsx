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
  reopened?: boolean
  myPlayerId: string | null
  myRole: 'developer' | 'scrum-master' | null
  currentVote: string | null
}

export function VoteGrid({ roomId, round, phase, reopened = false, myPlayerId, myRole, currentVote }: VoteGridProps) {
  const { setSelectedVote } = useGameStore()
  const { toast, showToast, clearToast } = useToast()
  const [confirmedVote, setConfirmedVote] = useState<string | null>(null)

  // Vote is open if: classic 'voting' phase, OR the SM re-opened this player
  // individually while the room is still in 'revealed' phase.
  const canVote = myRole === 'developer' && (phase === 'voting' || reopened)
  const disabled = !canVote

  async function handleCardClick(value: string) {
    if (disabled || !myPlayerId) return
    const supabase = createClient()

    if (currentVote === value) {
      setSelectedVote(null)
      setConfirmedVote(null)
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('room_id', roomId)
        .eq('player_id', myPlayerId)
        .eq('round', round)
      if (error) {
        showToast(`Annulation échouée : ${error.message}`)
        setSelectedVote(value)
      }
      return
    }

    setSelectedVote(value)
    setConfirmedVote(null)
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
  if (phase === 'revealed' && !reopened) return null

  const displayConfirmed = confirmedVote ?? (currentVote && canVote ? currentVote : null)

  const title = reopened
    ? 'Re-vote demandé par le Scrum Master'
    : phase === 'voting'
      ? 'Votre estimation'
      : 'En attente…'

  return (
    <div className={`card-surface flex flex-col gap-4 ${reopened ? 'vote-grid--reopened' : ''}`}>
      {reopened && (
        <div className="vote-grid__reopen-banner">
          <span aria-hidden>↺</span>
          <span>Le Scrum Master t&apos;a rouvert le vote — choisis ta nouvelle estimation, elle est prise en compte immédiatement.</span>
        </div>
      )}
      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
        {title}
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {FIBONACCI.map(val => (
          <VoteCard
            key={val}
            value={val}
            selected={currentVote === val}
            disabled={disabled}
            onClick={() => handleCardClick(val)}
          />
        ))}
      </div>
      {canVote && displayConfirmed && (
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontFamily: 'var(--font-primary)', fontWeight: 'var(--fw-medium)' }}>
          ✓ Vote enregistré : {displayConfirmed} <span style={{ color: 'var(--color-text-muted)' }}>— reclique la carte pour annuler</span>
        </p>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
