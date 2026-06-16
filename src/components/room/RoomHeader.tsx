'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BadgeRoomId, BadgeRound, BadgePhase } from '@/components/ui/Badge'
import { RoundTimer } from '@/components/room/RoundTimer'
import { useGameStore, useRoomSession } from '@/store/gameStore'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'
import type { Locale } from '@/lib/i18n/locales'
import type { Room } from '@/types'

interface RoomHeaderProps {
  room: Room
  connected: boolean
  displayRound?: number
  displayPhase?: 'waiting' | 'voting' | 'revealed'
  isHistoryMode?: boolean
  /** Durée de vote enregistrée du round affiché (figée). Affichée par le chrono
   *  hors phase de vote. */
  votingSeconds?: number | null
}

export function RoomHeader({ room, connected, displayRound, displayPhase, isHistoryMode, votingSeconds }: RoomHeaderProps) {
  const router = useRouter()
  const { dict, locale, setLocale } = useI18n()
  const tr = dict.room
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr'
  const session = useRoomSession(room.id)
  const { leaveRoom } = useGameStore()
  const [leaving, setLeaving] = useState(false)

  const handleLeave = async () => {
    if (leaving) return
    setLeaving(true)
    if (session?.playerId) {
      const supabase = createClient()
      // Best-effort delete, even if it fails (offline, RLS), we still clear the
      // local session so the user lands on a fresh lobby.
      await supabase.from('players').delete().eq('id', session.playerId).then(() => {}, () => {})
    }
    leaveRoom(room.id)
    router.push('/app')
  }

  return (
    <nav className="nav-room-header">
      <div className="flex items-center gap-2 flex-1">
        <Link href={`/${locale}`} aria-label="Scrumbler" className="nav-room-header__lockup">
          <Image
            src="/brand/logo/logo-horizontal.svg"
            alt="Scrumbler"
            width={140}
            height={32}
            priority
            style={{ height: 28, width: 'auto' }}
          />
        </Link>
        <BadgeRoomId id={room.id} />
        <BadgeRound label={fmt(tr.round, { n: displayRound ?? room.round })} />
        <BadgePhase phase={displayPhase ?? (room.phase as 'waiting' | 'voting' | 'revealed')} labels={tr.phase} />
        <RoundTimer
          phase={displayPhase ?? (room.phase as 'waiting' | 'voting' | 'revealed')}
          startedAt={isHistoryMode ? null : room.timer_started_at}
          frozenSeconds={votingSeconds}
        />
        {isHistoryMode && (
          <span
            className="badge-phase-waiting"
            style={{ borderColor: 'var(--color-violet)', color: 'var(--color-violet)', background: 'var(--color-violet-50)' }}
            title={tr.header.historyTitle}
          >
            📜 {tr.header.history}
          </span>
        )}
        {!connected && (
          <span
            className="badge-phase-waiting"
            style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning-dark)' }}
          >
            {tr.header.reconnecting}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="marketing-lang-switch"
          onClick={() => setLocale(otherLocale)}
          aria-label={`Switch to ${otherLocale.toUpperCase()}`}
        >
          {otherLocale.toUpperCase()}
        </button>
        <button
          onClick={handleLeave}
          disabled={leaving}
          className="btn-ghost-sm"
        >
          {leaving ? tr.header.leaving : tr.header.leave}
        </button>
      </div>
    </nav>
  )
}
