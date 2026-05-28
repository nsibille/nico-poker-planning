'use client'
import { useState } from 'react'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast, useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'
import type { Phase } from '@/types'

interface StoryPanelProps {
  roomId: string
  story: string
  phase: Phase
  isScrumMaster: boolean
  /** Live round number (= rooms.round). */
  round: number
  /** When set, edits target stories[round].title instead of rooms.story (history mode). */
  historyRound?: number | null
}

export function StoryPanel({ roomId, story, phase, isScrumMaster, round, historyRound }: StoryPanelProps) {
  const [draft, setDraft] = useState(story)
  const [lastSyncedStory, setLastSyncedStory] = useState(story)
  const [saving, setSaving] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const { toast, showToast, clearToast } = useToast()

  // Si la story change côté serveur (autre SM, nouveau round), on resynchronise
  // le brouillon local. Pattern "store previous & compare during render"
  // recommandé par React au lieu d'un useEffect → setState
  // (https://react.dev/learn/you-might-not-need-an-effect).
  if (story !== lastSyncedStory) {
    setLastSyncedStory(story)
    setDraft(story)
  }

  // Non-SM: read-only display whatever the phase.
  if (!isScrumMaster) {
    return (
      <div className="card-surface flex flex-col gap-3">
        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
          User Story
        </h3>
        <div className="story-display">
          {story || <span style={{ color: 'var(--color-text-muted)' }}>Aucune story définie</span>}
        </div>
      </div>
    )
  }

  const isWaiting = phase === 'waiting'
  const isRevealed = phase === 'revealed'
  const isLive = historyRound == null
  const showNextRound = isRevealed && isLive
  const hasUnsavedChanges = draft !== story
  const trimmedEmpty = !draft.trim()

  async function handleNextRound() {
    if (advancing) return
    setAdvancing(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('rooms')
      .update({ phase: 'waiting', story: '', round: round + 1 })
      .eq('id', roomId)
    if (error) {
      showToast(`Prochain round échoué : ${error.message}`, 'error')
    }
    setAdvancing(false)
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    const supabase = createClient()
    if (historyRound != null) {
      // History mode: edit the snapshotted story title without touching the
      // live room state.
      await supabase
        .from('stories')
        .update({ title: draft })
        .eq('room_id', roomId)
        .eq('round', historyRound)
    } else if (isWaiting) {
      // Persist story AND launch the round → phase 'voting'.
      await supabase.from('rooms').update({ story: draft, phase: 'voting' }).eq('id', roomId)
    } else {
      // Mid-round edit: persist the story only, don't touch phase or votes.
      await supabase.from('rooms').update({ story: draft }).eq('id', roomId)
    }
    setSaving(false)
  }

  const saveButtonLabel = isWaiting
    ? 'Lancer le vote'
    : saving
      ? 'Enregistrement…'
      : 'Enregistrer la modification'

  const saveButtonDisabled = trimmedEmpty || (!isWaiting && !hasUnsavedChanges) || saving
  // En revealed/voting on n'affiche le bouton de sauvegarde que s'il y a une
  // édition pending, sinon la card est encombrée d'un "À jour" inutile.
  const showSaveButton = isWaiting || hasUnsavedChanges

  return (
    <div className="card-surface flex flex-col gap-3">
      {isWaiting ? (
        <div className="story-new-round-banner">
          <span className="story-new-round-banner__title">
            <span aria-hidden>✨</span> Nouveau round {round}
          </span>
          <span className="story-new-round-banner__subtitle">
            Définis la story que ton équipe va estimer, puis lance le vote.
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
            User Story
          </h3>
          <span className={`story-status-pill story-status-pill--${phase}`}>
            {phase === 'voting' ? 'Vote en cours' : 'Révélé'}
            {hasUnsavedChanges && <span className="story-status-pill__dot" aria-label="modifications non sauvegardées" />}
          </span>
        </div>
      )}

      <Textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder={isWaiting ? 'Décris la story à estimer…' : 'Édite la story (sera mise à jour pour tout le monde)'}
        rows={3}
      />

      {isWaiting && trimmedEmpty && (
        <p className="story-helper">
          Renseigne une story pour lancer le vote du round.
        </p>
      )}

      <div className="flex items-center justify-end gap-2 flex-wrap">
        {showSaveButton && (
          <Button
            variant={isWaiting ? 'primary' : 'secondary'}
            onClick={handleSave}
            loading={saving && isWaiting}
            disabled={saveButtonDisabled}
          >
            {saveButtonLabel}
          </Button>
        )}
        {showNextRound && (
          <Button
            variant="primary"
            onClick={handleNextRound}
            loading={advancing}
            disabled={advancing}
          >
            Prochain round →
          </Button>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
