import type { Player, Vote, Story, ConsensusLevel } from '@/types'
import { numericValues, type EstimationScale } from './scales'

export interface PlayerStats {
  player: Player
  /** Total numeric votes cast (excludes '?' and missing). */
  numericVotes: number
  /** Number of '?' votes. */
  questionVotes: number
  /** Rounds where the player didn't vote at all (or '' sentinel). */
  missing: number
  /** Mean of their numeric votes, or null if none. */
  averageGiven: number | null
  /** Average fib-index distance from each round's mean. Lower = better aligned.
   *  Null if no numeric votes. */
  alignmentScore: number | null
  /** Their lowest numeric vote (most optimistic). */
  lowest: number | null
  /** Their highest numeric vote (most pessimistic). */
  highest: number | null
  /** Average response time (in seconds), last vote change minus the round's
   *  start (heuristically: the earliest vote in that round). Null if not
   *  computable (no rounds finalised with a numeric vote). */
  averageResponseSec: number | null
}

export interface Award {
  id: string
  icon: string
  title: string
  subtitle: string
  player: Player
  value?: string
}

export interface SessionStats {
  perPlayer: PlayerStats[]
  /** Stories (rounds) included in the analysis, only those with at least one numeric vote. */
  storiesWithData: Story[]
  /** Mean across all numeric votes of the session. */
  globalMean: number | null
  /** Sum of each story's mean (= velocity estimate). */
  totalStoryPoints: number
  storiesCount: number
  perfectConsensusCount: number
  divergentCount: number
  mostContested: Story | null
  mostUnanimous: Story | null
  awards: Award[]
}

function nearestScaleIndex(scaleNums: number[], value: number): number {
  if (scaleNums.length === 0) return 0
  let bestIdx = 0
  let bestDelta = Infinity
  for (let i = 0; i < scaleNums.length; i++) {
    const delta = Math.abs(scaleNums[i] - value)
    if (delta < bestDelta) { bestDelta = delta; bestIdx = i }
  }
  return bestIdx
}

function parseNumericVote(value: string): number | null {
  if (!value || value === '?') return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

export function computeSessionStats(
  scale: EstimationScale,
  players: Player[],
  votes: Vote[],
  stories: Story[],
): SessionStats {
  const scaleNums = numericValues(scale)
  const devs = players.filter(p => p.role === 'developer')

  // Index votes by player x round
  const votesByPlayer = new Map<string, Vote[]>()
  for (const v of votes) {
    const list = votesByPlayer.get(v.player_id) ?? []
    list.push(v)
    votesByPlayer.set(v.player_id, list)
  }

  // Per-round mean (use the snapshot from stories table when available, that's
  // what was actually validated by the team). Otherwise compute from votes.
  const roundMean = new Map<number, number>()
  const storiesByRound = new Map<number, Story>()
  for (const s of stories) {
    storiesByRound.set(s.round, s)
    if (s.final_mean !== null && s.final_mean !== undefined) {
      roundMean.set(s.round, s.final_mean)
    }
  }
  // For rounds without a story snapshot, derive mean from votes
  const roundsInVotes = new Set(votes.map(v => v.round))
  for (const r of roundsInVotes) {
    if (roundMean.has(r)) continue
    const nums = votes
      .filter(v => v.round === r)
      .map(v => parseNumericVote(v.value))
      .filter((n): n is number => n !== null)
    if (nums.length === 0) continue
    roundMean.set(r, nums.reduce((a, b) => a + b, 0) / nums.length)
  }

  // Round start time heuristic: the earliest vote.created_at for that round.
  // Underestimates the true voting_started_at (the SM clicked "Lancer le vote"
  // a bit before), but it's the same baseline for everyone so the comparison
  // remains fair.
  const roundStartedAt = new Map<number, number>()
  for (const v of votes) {
    const t = new Date(v.created_at).getTime()
    const prev = roundStartedAt.get(v.round)
    if (prev === undefined || t < prev) roundStartedAt.set(v.round, t)
  }

  const perPlayer: PlayerStats[] = devs.map(player => {
    const pv = votesByPlayer.get(player.id) ?? []
    let numericVotes = 0
    let questionVotes = 0
    let sum = 0
    let lowest: number | null = null
    let highest: number | null = null
    let alignSum = 0
    let alignCount = 0
    let respSum = 0
    let respCount = 0
    const seenRounds = new Set<number>()

    for (const v of pv) {
      seenRounds.add(v.round)
      if (v.value === '?') { questionVotes++; continue }
      const n = parseNumericVote(v.value)
      if (n === null) continue // empty sentinel
      numericVotes++
      sum += n
      lowest = lowest === null ? n : Math.min(lowest, n)
      highest = highest === null ? n : Math.max(highest, n)
      const rmean = roundMean.get(v.round)
      if (rmean !== undefined) {
        const playerIdx = nearestScaleIndex(scaleNums, n)
        const meanIdx = nearestScaleIndex(scaleNums, rmean)
        alignSum += Math.abs(playerIdx - meanIdx)
        alignCount++
      }
      // Response time = last-change timestamp (updated_at) minus the round
      // start. Falls back to created_at if the updated_at column isn't there
      // yet (migration 20260521020000 not applied).
      const start = roundStartedAt.get(v.round)
      const lastChange = (v.updated_at ?? v.created_at) as string
      if (start !== undefined) {
        const elapsed = (new Date(lastChange).getTime() - start) / 1000
        if (elapsed >= 0 && isFinite(elapsed)) {
          respSum += elapsed
          respCount++
        }
      }
    }

    const missing = Math.max(0, roundMean.size - seenRounds.size)
    return {
      player,
      numericVotes,
      questionVotes,
      missing,
      averageGiven: numericVotes > 0 ? sum / numericVotes : null,
      alignmentScore: alignCount > 0 ? alignSum / alignCount : null,
      lowest,
      highest,
      averageResponseSec: respCount > 0 ? respSum / respCount : null,
    }
  })

  // Global mean (across all numeric votes)
  const allNumeric = votes
    .map(v => parseNumericVote(v.value))
    .filter((n): n is number => n !== null)
  const globalMean = allNumeric.length > 0
    ? allNumeric.reduce((a, b) => a + b, 0) / allNumeric.length
    : null

  // Stories with data + sums
  const storiesWithData = stories
    .filter(s => roundMean.has(s.round))
    .sort((a, b) => a.round - b.round)

  let totalStoryPoints = 0
  for (const s of storiesWithData) totalStoryPoints += roundMean.get(s.round) ?? 0

  const perfectConsensusCount = stories.filter(s => s.consensus === 'perfect').length
  const divergentCount = stories.filter(s => s.consensus === 'divergent').length

  // Most contested / most unanimous (by spread among numeric votes for that round)
  let mostContested: Story | null = null
  let maxSpread = -1
  let mostUnanimous: Story | null = null
  let minSpread = Infinity
  for (const s of stories) {
    const nums = votes
      .filter(v => v.round === s.round)
      .map(v => parseNumericVote(v.value))
      .filter((n): n is number => n !== null)
    if (nums.length < 2) continue
    const idxs = nums.map(n => nearestScaleIndex(scaleNums, n))
    const spread = Math.max(...idxs) - Math.min(...idxs)
    if (spread > maxSpread) { maxSpread = spread; mostContested = s }
    if (spread < minSpread) { minSpread = spread; mostUnanimous = s }
  }

  // ── Awards ──
  const awards: Award[] = []
  const eligible = perPlayer.filter(p => p.numericVotes >= 1)

  // L'Optimiste (lowest averageGiven)
  const optimist = [...eligible]
    .filter(p => p.averageGiven !== null)
    .sort((a, b) => (a.averageGiven as number) - (b.averageGiven as number))[0]
  if (optimist) {
    awards.push({
      id: 'optimist',
      icon: '🌞',
      title: 'L\'Optimiste',
      subtitle: 'A vu la vie en petites complexités',
      player: optimist.player,
      value: (optimist.averageGiven as number).toFixed(1),
    })
  }

  // Le Pessimiste (highest averageGiven)
  const pessimist = [...eligible]
    .filter(p => p.averageGiven !== null)
    .sort((a, b) => (b.averageGiven as number) - (a.averageGiven as number))[0]
  if (pessimist && pessimist.player.id !== optimist?.player.id) {
    awards.push({
      id: 'pessimist',
      icon: '🌧️',
      title: 'Le Pessimiste',
      subtitle: 'A toujours pensé au pire des cas',
      player: pessimist.player,
      value: (pessimist.averageGiven as number).toFixed(1),
    })
  }

  // Le Caméléon (lowest alignmentScore)
  const chameleon = [...eligible]
    .filter(p => p.alignmentScore !== null)
    .sort((a, b) => (a.alignmentScore as number) - (b.alignmentScore as number))[0]
  if (chameleon) {
    awards.push({
      id: 'chameleon',
      icon: '🎯',
      title: 'Le Caméléon',
      subtitle: 'Toujours raccord avec l\'équipe',
      player: chameleon.player,
      value: (chameleon.alignmentScore as number) === 0
        ? 'Pile-poil'
        : `Δ ${(chameleon.alignmentScore as number).toFixed(2)}`,
    })
  }

  // Le Rebelle (highest alignmentScore)
  const rebel = [...eligible]
    .filter(p => p.alignmentScore !== null && (p.alignmentScore as number) > 0)
    .sort((a, b) => (b.alignmentScore as number) - (a.alignmentScore as number))[0]
  if (rebel && rebel.player.id !== chameleon?.player.id) {
    awards.push({
      id: 'rebel',
      icon: '🦄',
      title: 'Le Franc-Tireur',
      subtitle: 'Sa propre vision des choses',
      player: rebel.player,
      value: `Δ ${(rebel.alignmentScore as number).toFixed(2)}`,
    })
  }

  // L'Indécis (most '?' votes)
  const indecisive = [...perPlayer]
    .filter(p => p.questionVotes > 0)
    .sort((a, b) => b.questionVotes - a.questionVotes)[0]
  if (indecisive) {
    awards.push({
      id: 'indecisive',
      icon: '🌀',
      title: 'L\'Indécis',
      subtitle: 'A préféré ne pas se prononcer',
      player: indecisive.player,
      value: `${indecisive.questionVotes} × ?`,
    })
  }

  // La Machine (fastest average response time, last vote change makes faith)
  const machine = [...perPlayer]
    .filter(p => p.averageResponseSec !== null && p.numericVotes > 0)
    .sort((a, b) => (a.averageResponseSec as number) - (b.averageResponseSec as number))[0]
  if (machine) {
    awards.push({
      id: 'machine',
      icon: '🚀',
      title: 'La Machine',
      subtitle: 'A chiffré le plus vite en moyenne',
      player: machine.player,
      value: formatDuration(machine.averageResponseSec as number),
    })
  }

  return {
    perPlayer,
    storiesWithData,
    globalMean,
    totalStoryPoints,
    storiesCount: stories.length,
    perfectConsensusCount,
    divergentCount,
    mostContested,
    mostUnanimous,
    awards,
  }
}

/** Human-readable duration: 8.4s / 1m 23s / 2m 05s. */
export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return ','
  if (seconds < 60) {
    return seconds < 10 ? `${seconds.toFixed(1)}s` : `${Math.round(seconds)}s`
  }
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds - m * 60)
  return s === 0 ? `${m}min` : `${m}min ${s.toString().padStart(2, '0')}`
}

export function consensusEmoji(c: ConsensusLevel | string | null): string {
  switch (c) {
    case 'perfect': return '🎯'
    case 'aligned': return '✓'
    case 'discuss': return '💬'
    case 'divergent': return '⚠️'
    default: return '·'
  }
}
