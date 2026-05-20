import { calcMean } from '@/lib/game/utils'
import type { Vote } from '@/types'

export function MeanDisplay({ votes }: { votes: Vote[] }) {
  const mean = calcMean(votes)
  if (mean === null) return null

  return (
    <div className="mean-display">
      <div className="mean-value">{mean}</div>
      <div className="mean-label">Moyenne</div>
    </div>
  )
}
