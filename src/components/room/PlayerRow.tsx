'use client'
import { Avatar } from '@/components/ui/Avatar'
import { useI18n } from '@/lib/i18n/I18nProvider'
import type { Player, Vote, Phase } from '@/types'

interface PlayerRowProps {
  player: Player
  vote: Vote | undefined
  phase: Phase
  isMe: boolean
}

export function PlayerRow({ player, vote, phase, isMe }: PlayerRowProps) {
  const { dict } = useI18n()
  // No role badge here, the section header ("SCRUM MASTERS" / "DÉVELOPPEURS")
  // in PlayersList already disambiguates, and dropping the chip gives much
  // more room for the name in the narrow sidebar.
  return (
    <div className="card-player-row">
      <Avatar name={player.name} role={player.role as 'developer' | 'scrum-master'} emoji={player.emoji} />
      <div className="player-name" title={player.name}>
        <span className="player-name__label">{player.name}</span>
        {isMe && <span className="player-name__me">{dict.room.players.me}</span>}
      </div>
      {player.role === 'developer' && (() => {
        // value === '' = sentinel "vote rouvert" → considéré comme pas voté.
        const activeVote = vote && vote.value !== '' ? vote : undefined
        if (phase === 'revealed' && activeVote) {
          return <div className="vote-card-revealed">{activeVote.value}</div>
        }
        if (activeVote) {
          return <div className="status-voted">✓</div>
        }
        return <div className="status-waiting">…</div>
      })()}
    </div>
  )
}
