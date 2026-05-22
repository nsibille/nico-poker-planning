import type { Player, Vote } from '@/types'

export const FIB_NUMERIC = [1, 2, 3, 5, 8, 13, 21] as const

export type ConsensusLevel = 'perfect' | 'aligned' | 'discuss' | 'divergent' | 'empty'

export interface VoteEntry {
  player: Player
  value: string | null
  numeric: number | null
  fibIndex: number | null
  isOutlier: boolean
}

export interface RevealStats {
  entries: VoteEntry[]
  numericCount: number
  questionCount: number
  missingCount: number
  mean: number | null
  meanFibIndex: number | null
  min: number | null
  max: number | null
  /** Range in Fibonacci-index steps. */
  spreadIndex: number
  consensus: ConsensusLevel
  outliers: VoteEntry[]
}

const CONSENSUS_LABEL: Record<ConsensusLevel, string> = {
  perfect: 'Consensus parfait',
  aligned: 'Cohérent',
  discuss: 'À discuter',
  divergent: 'Divergent',
  empty: 'Aucun vote',
}

const CONSENSUS_HINT: Record<ConsensusLevel, string> = {
  perfect: 'Tout le monde a voté la même valeur — direct au prochain ticket.',
  aligned: 'Les estimations sont proches. Le ticket peut être validé.',
  discuss: 'Les écarts sont notables — un échange rapide est recommandé.',
  divergent: 'Les estimations divergent fortement. Discutez avant de valider.',
  empty: '',
}

const CONSENSUS_ICON: Record<ConsensusLevel, string> = {
  perfect: '🎯',
  aligned: '✓',
  discuss: '💬',
  divergent: '⚠️',
  empty: '·',
}

export function consensusLabel(c: ConsensusLevel) { return CONSENSUS_LABEL[c] }
export function consensusHint(c: ConsensusLevel) { return CONSENSUS_HINT[c] }
export function consensusIcon(c: ConsensusLevel) { return CONSENSUS_ICON[c] }

function nearestFibIndex(value: number): number {
  let bestIdx = 0
  let bestDelta = Infinity
  for (let i = 0; i < FIB_NUMERIC.length; i++) {
    const delta = Math.abs(FIB_NUMERIC[i] - value)
    if (delta < bestDelta) { bestDelta = delta; bestIdx = i }
  }
  return bestIdx
}

export function computeRevealStats(players: Player[], votes: Vote[]): RevealStats {
  const devs = players.filter(p => p.role === 'developer')
  const entries: VoteEntry[] = devs.map(player => {
    const v = votes.find(x => x.player_id === player.id)
    // A vote row with an empty value is the "reopened" sentinel — treat it like
    // an absent vote (no DELETE policy needed in the DB).
    const raw = v && v.value !== '' ? v.value : null
    let numeric: number | null = null
    let fibIndex: number | null = null
    if (raw && raw !== '?') {
      const n = Number(raw)
      if (!Number.isNaN(n)) {
        numeric = n
        const idx = FIB_NUMERIC.indexOf(n as (typeof FIB_NUMERIC)[number])
        fibIndex = idx >= 0 ? idx : nearestFibIndex(n)
      }
    }
    return { player, value: raw, numeric, fibIndex, isOutlier: false }
  })

  const numericEntries = entries.filter(e => e.numeric !== null) as Array<VoteEntry & { numeric: number; fibIndex: number }>
  const questionCount = entries.filter(e => e.value === '?').length
  const missingCount = entries.filter(e => e.value === null).length

  if (numericEntries.length === 0) {
    return {
      entries,
      numericCount: 0,
      questionCount,
      missingCount,
      mean: null,
      meanFibIndex: null,
      min: null,
      max: null,
      spreadIndex: 0,
      consensus: 'empty',
      outliers: [],
    }
  }

  const nums = numericEntries.map(e => e.numeric)
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length
  const meanFibIndex = nearestFibIndex(mean)
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const indices = numericEntries.map(e => e.fibIndex)
  const spreadIndex = Math.max(...indices) - Math.min(...indices)

  let consensus: ConsensusLevel
  if (spreadIndex === 0 && questionCount === 0) consensus = 'perfect'
  else if (spreadIndex <= 1) consensus = 'aligned'
  else if (spreadIndex <= 2) consensus = 'discuss'
  else consensus = 'divergent'

  let outliers: VoteEntry[] = []
  if (consensus === 'discuss' || consensus === 'divergent') {
    // Clustering simple sur l'index Fibonacci : la "taille de cluster" d'un
    // votant est le nombre de votants à ≤ 1 cran de lui (lui inclus). Si un
    // cluster regroupe strictement plus de la moitié des votants, on flagge
    // ceux qui n'en font pas partie. Sinon aucune majorité claire — tout le
    // monde discute.
    const sizes = numericEntries.map(e =>
      numericEntries.filter(o => Math.abs(o.fibIndex - e.fibIndex) <= 1).length,
    )
    const maxCluster = Math.max(...sizes)
    outliers = maxCluster > numericEntries.length / 2
      ? numericEntries.filter((_, i) => sizes[i] < maxCluster)
      : numericEntries
    outliers.forEach(o => { o.isOutlier = true })
  }

  return {
    entries,
    numericCount: numericEntries.length,
    questionCount,
    missingCount,
    mean,
    meanFibIndex,
    min,
    max,
    spreadIndex,
    consensus,
    outliers,
  }
}

export function formatMean(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)
}
