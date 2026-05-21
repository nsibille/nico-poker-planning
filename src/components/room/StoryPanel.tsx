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

  useEffect(() => { setDraft(story) }, [story])

  const isVoting = phase === 'voting'
  const canEdit = isScrumMaster && phase === 'waiting'

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('rooms').update({ story: draft, phase: 'voting' }).eq('id', roomId)
    setSaving(false)
  }

  if (!isScrumMaster || phase === 'revealed') {
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

  return (
    <div className="card-surface flex flex-col gap-3">
      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
        User Story
      </h3>
      <Textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Décris la story à estimer…"
        rows={3}
        disabled={!canEdit}
      />
      <Button
        variant="secondary"
        onClick={handleSave}
        loading={saving}
        disabled={isVoting || !draft.trim()}
        className="self-end"
      >
        {isVoting ? 'Vote en cours' : 'Lancer le vote'}
      </Button>
    </div>
  )
}
