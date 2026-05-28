'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Toast, useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'
import { computeRevealStats } from '@/lib/game/reveal-stats'
import type { EstimationScale } from '@/lib/game/scales'
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
  scale: EstimationScale
}

export function StatusBar({ roomId, phase, round, liveRound, isHistoryMode, story, players, votes, isScrumMaster, scale }: StatusBarProps) {
  const [loading, setLoading] = useState(false)
  const [endConfirm, setEndConfirm] = useState(false)
  const { toast, showToast, clearToast } = useToast()

  async function handleEndSession() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('rooms')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', roomId)
    if (error) {
      showToast(`Fin de session échouée : ${error.message}`)
    }
    setLoading(false)
    setEndConfirm(false)
  }

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
    const stats = computeRevealStats(scale, players, votes)
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

  // En mode historique, on cache les contrôles de workflow live, le SM
  // consulte un round passé en local. Les CTA "Retour" et "Rouvrir pour tout
  // le monde" vivent dans HistoryBanner. Le mode historique est strictement
  // local au SM : les devs ne passent jamais par ici.
  if (isHistoryMode) {
    return (
      <div className="card-surface flex flex-col gap-2">
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-primary)' }}>
          Tu consultes le round {round}, vue locale. Clique « Re-voter » sous un participant pour rouvrir son vote, ou « Rouvrir pour tout le monde » dans le bandeau pour forcer un nouveau vote sur ce round. Round live actuel : {liveRound}.
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
                  title={allVoted ? undefined : 'Tous les devs n\'ont pas voté, révéler quand même ?'}
                >
                  Révéler les votes
                </Button>
              </div>
            )}
            {phase === 'revealed' && !endConfirm && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn-ghost-sm status-bar__end-session"
                  onClick={() => setEndConfirm(true)}
                  disabled={loading}
                  title="Affiche l'écran final à tous les participants"
                >
                  🏁 Terminer la session
                </button>
              </div>
            )}
            {phase === 'revealed' && endConfirm && (
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-primary)' }}>
                  Tout le monde verra le récap final.
                </span>
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => setEndConfirm(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <Button variant="danger" onClick={handleEndSession} loading={loading}>
                  Oui, terminer
                </Button>
              </div>
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
