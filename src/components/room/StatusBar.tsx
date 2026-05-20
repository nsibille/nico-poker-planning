'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { MeanDisplay } from './MeanDisplay'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import type { Player, Vote, Phase } from '@/types'

interface StatusBarProps {
  roomId: string
  phase: Phase
  round: number
  players: Player[]
  votes: Vote[]
  isScrumMaster: boolean
}

export function StatusBar({ roomId, phase, round, players, votes, isScrumMaster }: StatusBarProps) {
  const { setSelectedVote } = useGameStore()
  const [loading, setLoading] = useState(false)

  const devs = players.filter(p => p.role === 'developer')
  const devVotes = votes.filter(v => devs.some(d => d.id === v.player_id))
  const allVoted = devs.length > 0 && devVotes.length >= devs.length

  async function handleReveal() {
    if (!allVoted || loading) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('rooms').update({ phase: 'revealed' }).eq('id', roomId)
    setLoading(false)
  }

  async function handleNextRound() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('rooms')
      .update({ phase: 'voting', story: '', round: round + 1 })
      .eq('id', roomId)
    setSelectedVote(null)
    setLoading(false)
  }

  return (
    <div className="card-surface flex flex-wrap items-center gap-4">
      {phase === 'revealed' && (
        <MeanDisplay votes={votes} />
      )}

      <div className="flex-1" />

      {isScrumMaster && (
        <>
          {phase === 'voting' && (
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-primary)' }}>
                {devVotes.length}/{devs.length} vote{devs.length !== 1 ? 's' : ''}
              </span>
              <Button
                variant="reveal"
                onClick={handleReveal}
                disabled={!allVoted}
                loading={loading}
              >
                Révéler les votes
              </Button>
            </div>
          )}
          {phase === 'revealed' && (
            <Button
              variant="primary"
              onClick={handleNextRound}
              loading={loading}
            >
              Prochain round →
            </Button>
          )}
          {phase === 'waiting' && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-primary)' }}>
              Définissez une story pour lancer le vote
            </span>
          )}
        </>
      )}
    </div>
  )
}
