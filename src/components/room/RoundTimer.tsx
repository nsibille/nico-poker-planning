'use client'
import { useEffect, useState } from 'react'
import { formatClock } from '@/lib/game/session-stats'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'
import type { Phase } from '@/types'

interface RoundTimerProps {
  phase: Phase
  /** Départ du chrono (rooms.timer_started_at). */
  startedAt: string | null
  /** Durée enregistrée du round affiché (figée au reveal). Utilisée hors phase
   *  de vote pour afficher le temps final du round. */
  frozenSeconds?: number | null
}

function baseNow(startedAt: string | null): number {
  // On part du timestamp de départ pour que le premier rendu soit déterministe
  // (0:00) côté serveur ET client : pas de mismatch d'hydratation. Le tick
  // client prend le relais ensuite.
  return startedAt ? new Date(startedAt).getTime() : Date.now()
}

/**
 * Chrono de round, slug `badge-timer`. Croissant et indicatif : démarre quand
 * le SM lance le vote, ticke pendant la phase de vote, puis se fige sur la
 * durée enregistrée une fois les votes révélés.
 */
export function RoundTimer({ phase, startedAt, frozenSeconds }: RoundTimerProps) {
  const { dict } = useI18n()
  const tt = dict.room.timer
  const live = phase === 'voting' && !!startedAt

  const [now, setNow] = useState<number>(() => baseNow(startedAt))
  // Pattern "store previous & compare during render" (recommandé par React) :
  // si le départ change (nouveau round, ré-ouverture), on rebase le chrono sans
  // useEffect → setState.
  const [lastStart, setLastStart] = useState(startedAt)
  if (startedAt !== lastStart) {
    setLastStart(startedAt)
    setNow(baseNow(startedAt))
  }

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [live, startedAt])

  let seconds: number | null = null
  if (live && startedAt) {
    seconds = Math.max(0, (now - new Date(startedAt).getTime()) / 1000)
  } else if (frozenSeconds != null) {
    seconds = frozenSeconds
  }

  if (seconds === null) return null

  return (
    <span
      className={`badge-timer${live ? ' badge-timer--live' : ''}`}
      title={live ? tt.live : tt.frozen}
      aria-label={fmt(tt.aria, { time: formatClock(seconds) })}
    >
      <span className="badge-timer__icon" aria-hidden>⏱</span>
      <span className="badge-timer__value">{formatClock(seconds)}</span>
    </span>
  )
}
