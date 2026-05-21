'use client'
import { useState, useRef, useEffect } from 'react'
import { PLAYER_EMOJIS, randomPlayerEmoji } from '@/lib/game/emojis'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="emoji-picker" ref={rootRef}>
      <label className="emoji-picker__label">Ton avatar</label>
      <div className="emoji-picker__row">
        <button
          type="button"
          className="emoji-picker__preview"
          onClick={() => setOpen(o => !o)}
          aria-label="Choisir un autre emoji"
        >
          <span aria-hidden>{value}</span>
        </button>
        <button
          type="button"
          className="emoji-picker__dice"
          onClick={() => onChange(randomPlayerEmoji(value))}
          aria-label="Emoji aléatoire"
          title="Re-roll"
        >
          🎲
        </button>
        <span className="emoji-picker__hint">Clique l&apos;avatar pour choisir, ou le dé pour re-roll</span>
      </div>

      {open && (
        <div className="emoji-picker__grid" role="listbox">
          {PLAYER_EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              className={`emoji-picker__cell${e === value ? ' is-selected' : ''}`}
              onClick={() => { onChange(e); setOpen(false) }}
              aria-label={`Choisir ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
