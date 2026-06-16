'use client'
import { PlayerRow } from './PlayerRow'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'
import type { Player, Vote, Phase } from '@/types'

interface PlayersListProps {
  players: Player[]
  votes: Vote[]
  phase: Phase
  myPlayerId: string | null
}

export function PlayersList({ players, votes, phase, myPlayerId }: PlayersListProps) {
  const { dict } = useI18n()
  const tp = dict.room.players
  const devs = players.filter(p => p.role === 'developer')
  const sms = players.filter(p => p.role === 'scrum-master')

  return (
    <div className="card-surface flex flex-col gap-2">
      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)', marginBottom: '8px' }}>
        {fmt(tp.title, { n: players.length })}
      </h3>

      {sms.length > 0 && (
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', fontFamily: 'var(--font-primary)' }}>
            {tp.scrumMasters}
          </div>
          {sms.map(p => (
            <PlayerRow
              key={p.id}
              player={p}
              vote={votes.find(v => v.player_id === p.id)}
              phase={phase}
              isMe={p.id === myPlayerId}
            />
          ))}
        </div>
      )}

      {devs.length > 0 && (
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', marginTop: '8px', fontFamily: 'var(--font-primary)' }}>
            {tp.developers}
          </div>
          {devs.map(p => (
            <PlayerRow
              key={p.id}
              player={p}
              vote={votes.find(v => v.player_id === p.id)}
              phase={phase}
              isMe={p.id === myPlayerId}
            />
          ))}
        </div>
      )}

      {players.length === 0 && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-primary)' }}>
          {tp.none}
        </p>
      )}
    </div>
  )
}
