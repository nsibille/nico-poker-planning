'use client'
import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Phase } from '@/types'

interface StoryPanelProps {
  roomId: string
  story: string
  phase: Phase
  isScrumMaster: boolean
}

export function StoryPanel({ roomId, story, phase, isScrumMaster }: StoryPanelProps) {
  const [draft, setDraft] = useState(story)
  const [saving, setSaving] = useState(false)

  // Sync draft when the room's story changes server-side (e.g. another SM updates it,
  // or we start a new round with an empty story).
  useEffect(() => { setDraft(story) }, [story])

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
  const hasUnsavedChanges = draft !== story
  const trimmedEmpty = !draft.trim()

  async function handleSave() {
    if (saving) return
    setSaving(true)
    const supabase = createClient()
    if (isWaiting) {
      // Persist story AND launch the round → phase 'voting'.
      await supabase.from('rooms').update({ story: draft, phase: 'voting' }).eq('id', roomId)
    } else {
      // Mid-round edit: persist the story only, don't touch phase or votes.
      await supabase.from('rooms').update({ story: draft }).eq('id', roomId)
    }
    setSaving(false)
  }

  const buttonLabel = isWaiting
    ? 'Lancer le vote'
    : saving
      ? 'Enregistrement…'
      : hasUnsavedChanges
        ? 'Enregistrer la modification'
        : 'À jour'

  const buttonDisabled = trimmedEmpty || (!isWaiting && !hasUnsavedChanges) || saving

  return (
    <div className="card-surface flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
          User Story
        </h3>
        {!isWaiting && (
          <span className={`story-status-pill story-status-pill--${phase}`}>
            {phase === 'voting' ? 'Vote en cours' : 'Révélé'}
            {hasUnsavedChanges && <span className="story-status-pill__dot" aria-label="modifications non sauvegardées" />}
          </span>
        )}
      </div>

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

      <Button
        variant={isWaiting ? 'primary' : 'secondary'}
        onClick={handleSave}
        loading={saving && isWaiting}
        disabled={buttonDisabled}
        className="self-end"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
