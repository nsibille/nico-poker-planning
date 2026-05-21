import { Avatar } from '@/components/ui/Avatar'
import { BadgeRole } from '@/components/ui/Badge'
import type { Player, Vote, Phase } from '@/types'

interface PlayerRowProps {
  player: Player
  vote: Vote | undefined
  phase: Phase
  isMe: boolean
}

export function PlayerRow({ player, vote, phase, isMe }: PlayerRowProps) {
  return (
    <div className="card-player-row">
      <Avatar name={player.name} role={player.role as 'developer' | 'scrum-master'} emoji={player.emoji} />
      <div className="player-name">
        {player.name}
        {isMe && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginLeft: '6px' }}>(moi)</span>}
      </div>
      <BadgeRole role={player.role as 'developer' | 'scrum-master'} />
      {player.role === 'developer' && (
        phase === 'revealed' && vote ? (
          <div className="vote-card-revealed">{vote.value}</div>
        ) : vote ? (
          <div className="status-voted">✓</div>
        ) : (
          <div className="status-waiting">…</div>
        )
      )}
    </div>
  )
}
