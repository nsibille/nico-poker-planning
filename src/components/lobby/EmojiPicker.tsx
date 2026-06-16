'use client'
import { useState, useRef, useEffect } from 'react'
import { PLAYER_EMOJIS, randomPlayerEmoji } from '@/lib/game/emojis'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const { dict } = useI18n()
  const tf = dict.app.form
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
      <label className="emoji-picker__label">{tf.avatar}</label>
      <div className="emoji-picker__row">
        <button
          type="button"
          className="emoji-picker__preview"
          onClick={() => setOpen(o => !o)}
          aria-label={tf.avatarChoose}
        >
          <span aria-hidden>{value}</span>
        </button>
        <button
          type="button"
          className="emoji-picker__dice"
          onClick={() => onChange(randomPlayerEmoji(value))}
          aria-label={tf.avatarRandom}
          title={tf.avatarReroll}
        >
          🎲
        </button>
        <span className="emoji-picker__hint">{tf.avatarHint}</span>
      </div>

      {open && (
        <div className="emoji-picker__grid" role="listbox">
          {PLAYER_EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              className={`emoji-picker__cell${e === value ? ' is-selected' : ''}`}
              onClick={() => { onChange(e); setOpen(false) }}
              aria-label={fmt(tf.avatarPick, { emoji: e })}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
