'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Toast, useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { computeRevealStats } from '@/lib/game/reveal-stats'
import type { Player, Vote, Phase } from '@/types'

interface StatusBarProps {
  roomId: string
  phase: Phase
  round: number
  /** Live round of the room (= rooms.round). May differ from `round` in history mode. */
  liveRound: number
  isHistoryMode: boolean
  /** Story title currently displayed (used to snapshot it on reveal). */
  story: string
  players: Player[]
  votes: Vote[]
  isScrumMaster: boolean
}

export function StatusBar({ roomId, phase, round, liveRound, isHistoryMode, story, players, votes, isScrumMaster }: StatusBarProps) {
  const { setSelectedVote } = useGameStore()
  const [loading, setLoading] = useState(false)
  const { toast, showToast, clearToast } = useToast()

  const devs = players.filter(p => p.role === 'developer')
  const hasActiveVote = (devId: string) => votes.some(v => v.player_id === devId && v.value !== '')
  const voted = devs.filter(d => hasActiveVote(d.id))
  const pending = devs.filter(d => !hasActiveVote(d.id))
  const hasDevs = devs.length > 0
  const allVoted = hasDevs && pending.length === 0

  async function handleReveal() {
    if (!hasDevs || loading) return
    setLoading(true)
    const supabase = createClient()
    const stats = computeRevealStats(players, votes)
    // Snapshot the round → stories before flipping the phase. Upsert lets us
    // re-reveal an already-revealed round (e.g. after the SM re-opens votes).
    const { error: storyError } = await supabase.from('stories').upsert({
      room_id: roomId,
      round: liveRound,
      title: story,
      final_mean: stats.mean,
      consensus: stats.consensus,
    }, { onConflict: 'room_id,round' })
    if (storyError) {
      showToast(`Snapshot story échoué : ${storyError.message}. La migration timeline a-t-elle été appliquée ?`)
      setLoading(false)
      return
    }
    const { error: roomError } = await supabase.from('rooms').update({ phase: 'revealed' }).eq('id', roomId)
    if (roomError) showToast(`Reveal échoué : ${roomError.message}`)
    setLoading(false)
  }

  async function handleNextRound() {
    setLoading(true)
    const supabase = createClient()
    // First attempt: also reset viewing_round (history mode). If the column
    // doesn't exist yet (migration not applied), retry without that field so
    // the SM is at least unblocked.
    let { error } = await supabase
      .from('rooms')
      .update({ phase: 'waiting', story: '', round: liveRound + 1, viewing_round: null })
      .eq('id', roomId)
    if (error && /viewing_round/.test(error.message)) {
      const retry = await supabase
        .from('rooms')
        .update({ phase: 'waiting', story: '', round: liveRound + 1 })
        .eq('id', roomId)
      error = retry.error
      if (!error) {
        showToast('Round avancé, mais la migration timeline n\'est pas appliquée — applique le SQL pour activer l\'historique.')
      }
    }
    if (error) {
      showToast(`Prochain round échoué : ${error.message}`)
      setLoading(false)
      return
    }
    setSelectedVote(null)
    setLoading(false)
  }

  // In history mode, hide live workflow controls — the SM is reviewing a past
  // round. The "Retour au round courant" CTA lives in the HistoryBanner.
  if (isHistoryMode) {
    return (
      <div className="card-surface flex flex-col gap-2">
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-primary)' }}>
          {isScrumMaster
            ? `Tu consultes le round ${round}. Clique « Re-voter » sous un participant pour rouvrir son vote, ou reviens au round courant (${liveRound}) pour continuer.`
            : `Round ${round} — vue historique partagée par le Scrum Master.`}
        </span>
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      </div>
    )
  }

  return (
    <div className="card-surface flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1" />

        {isScrumMaster && (
          <>
            {phase === 'voting' && (
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-primary)' }}>
                  {voted.length}/{devs.length} vote{devs.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="reveal"
                  onClick={handleReveal}
                  disabled={!hasDevs}
                  loading={loading}
                  title={allVoted ? undefined : 'Tous les devs n\'ont pas voté — révéler quand même ?'}
                >
                  Révéler les votes
                </Button>
              </div>
            )}
            {phase === 'revealed' && (
              <Button variant="primary" onClick={handleNextRound} loading={loading}>
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

      {isScrumMaster && phase === 'voting' && hasDevs && (
        <div className="flex flex-col gap-1" style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--text-sm)' }}>
          {voted.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span style={{ color: 'var(--color-success, #1aa37a)', fontWeight: 'var(--fw-medium)' }}>✓ A voté :</span>
              <span style={{ color: 'var(--color-text-primary)' }}>
                {voted.map(d => d.name).join(', ')}
              </span>
            </div>
          )}
          {pending.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>… En attente :</span>
              <span style={{ color: 'var(--color-text-primary)' }}>
                {pending.map(d => d.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
