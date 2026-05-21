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
      <div className="player-name" title={player.name}>
        <span className="player-name__label">{player.name}</span>
        {isMe && <span className="player-name__me">(moi)</span>}
      </div>
      <BadgeRole role={player.role as 'developer' | 'scrum-master'} />
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
