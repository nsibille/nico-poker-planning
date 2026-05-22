import type { Player, Vote } from '@/types'
import {
  activeValues,
  isNumericScale,
  SPECIAL_VALUES,
  type EstimationScale,
} from './scales'

export type ConsensusLevel = 'perfect' | 'aligned' | 'discuss' | 'divergent' | 'empty'

export interface VoteEntry {
  player: Player
  value: string | null
  /** Valeur numérique (uniquement pour les échelles numériques et les cartes actives). */
  numeric: number | null
  /** Position dans les valeurs "actives" de l'échelle (sans `?`/`☕`). null si vote inactif. */
  scaleIndex: number | null
  isOutlier: boolean
}

export interface RevealStats {
  scale: EstimationScale
  entries: VoteEntry[]
  /** Nombre de votes "actifs" (valeur ≠ null/?/☕). */
  activeCount: number
  questionCount: number
  coffeeCount: number
  missingCount: number
  /** Moyenne, null si l'échelle n'est pas numérique. */
  mean: number | null
  /** Valeur la plus fréquente parmi les votes actifs. Tie-break : index le + élevé. */
  mode: string | number | null
  min: string | number | null
  max: string | number | null
  /** Range en pas d'index sur l'échelle. */
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
  perfect: 'Tout le monde a voté la même valeur, direct au prochain ticket.',
  aligned: 'Les estimations sont proches. Le ticket peut être validé.',
  discuss: 'Les écarts sont notables, un échange rapide est recommandé.',
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

export function computeRevealStats(scale: EstimationScale, players: Player[], votes: Vote[]): RevealStats {
  const active = activeValues(scale)
  const isNum = isNumericScale(scale)
  const devs = players.filter(p => p.role === 'developer')

  const entries: VoteEntry[] = devs.map(player => {
    const v = votes.find(x => x.player_id === player.id)
    // Vote row avec value='' = sentinel "reopened", comme un vote absent.
    const raw = v && v.value !== '' ? v.value : null
    let numeric: number | null = null
    let scaleIndex: number | null = null
    if (raw && !SPECIAL_VALUES.has(raw)) {
      const idx = active.findIndex(av => String(av) === raw)
      if (idx >= 0) {
        scaleIndex = idx
        const v = active[idx]
        if (typeof v === 'number') numeric = v
      }
    }
    return { player, value: raw, numeric, scaleIndex, isOutlier: false }
  })

  const activeEntries = entries.filter(
    (e): e is VoteEntry & { scaleIndex: number } => e.scaleIndex !== null,
  )
  const questionCount = entries.filter(e => e.value === '?').length
  const coffeeCount = entries.filter(e => e.value === '☕').length
  const missingCount = entries.filter(e => e.value === null).length

  if (activeEntries.length === 0) {
    return {
      scale, entries,
      activeCount: 0, questionCount, coffeeCount, missingCount,
      mean: null, mode: null, min: null, max: null,
      spreadIndex: 0, consensus: 'empty', outliers: [],
    }
  }

  // Mode, utile pour les échelles non-numériques mais calculé partout.
  // Tie-break = index le plus haut (estimation prudente).
  const counts = new Map<number, number>()
  for (const e of activeEntries) counts.set(e.scaleIndex, (counts.get(e.scaleIndex) ?? 0) + 1)
  let modeIdx = activeEntries[0].scaleIndex
  let modeCount = 0
  for (const [idx, c] of counts) {
    if (c > modeCount || (c === modeCount && idx > modeIdx)) { modeIdx = idx; modeCount = c }
  }
  const mode = active[modeIdx]

  const indices = activeEntries.map(e => e.scaleIndex)
  const minIdx = Math.min(...indices)
  const maxIdx = Math.max(...indices)
  const spreadIndex = maxIdx - minIdx

  const nums = activeEntries.map(e => e.numeric).filter((n): n is number => n !== null)
  const mean = isNum && nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : null

  let consensus: ConsensusLevel
  if (spreadIndex === 0 && questionCount === 0) consensus = 'perfect'
  else if (spreadIndex <= 1) consensus = 'aligned'
  else if (spreadIndex <= 2) consensus = 'discuss'
  else consensus = 'divergent'

  // Clustering simple sur l'index de l'échelle : cluster d'un votant = nombre
  // de votants à ≤ 1 cran (lui inclus). Si un cluster regroupe strictement plus
  // de la moitié des votants, on flagge les autres. Sinon aucune majorité ,
  // tout le monde discute.
  let outliers: VoteEntry[] = []
  if (consensus === 'discuss' || consensus === 'divergent') {
    const sizes = activeEntries.map(e =>
      activeEntries.filter(o => Math.abs(o.scaleIndex - e.scaleIndex) <= 1).length,
    )
    const maxCluster = Math.max(...sizes)
    outliers = maxCluster > activeEntries.length / 2
      ? activeEntries.filter((_, i) => sizes[i] < maxCluster)
      : activeEntries
    outliers.forEach(o => { o.isOutlier = true })
  }

  return {
    scale, entries,
    activeCount: activeEntries.length, questionCount, coffeeCount, missingCount,
    mean, mode,
    min: active[minIdx], max: active[maxIdx],
    spreadIndex, consensus, outliers,
  }
}

export function formatMean(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)
}
