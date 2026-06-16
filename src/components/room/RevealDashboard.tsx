'use client'
import { useEffect, useState, useTransition } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Toast, useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'
import {
  computeRevealStats,
  consensusIcon,
  formatMean,
  type ConsensusLevel,
  type VoteEntry,
} from '@/lib/game/reveal-stats'
import {
  activeValues,
  isNumericScale,
  numericValues,
  roundUpToScaleCard,
  type EstimationScale,
} from '@/lib/game/scales'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'
import type { Dictionary } from '@/lib/i18n/dict'
import type { Player, Vote, Story } from '@/types'

/** Unité d'estimation traduite (pts / JH / md), vide pour les échelles non
 *  numériques. */
function localizedUnit(unit: EstimationScale['unit'], dict: Dictionary): string {
  if (unit === 'points') return dict.room.units.points
  if (unit === 'days') return dict.room.units.days
  return ''
}

interface RevealDashboardProps {
  players: Player[]
  votes: Vote[]
  round: number
  roomId: string
  isScrumMaster: boolean
  scale: EstimationScale
  storyTitle?: string
  /** Row from `stories` matching the displayed round, if any. Used to detect
   *  drift between computed stats and the snapshot (e.g. after a re-vote) and
   *  resync only when needed. */
  currentStory?: Story | null
}

function tierForRatio(ratio: number): string {
  if (ratio <= 0.25) return 'EASY'
  if (ratio <= 0.5) return 'MEDIUM'
  if (ratio <= 0.75) return 'HARD'
  return 'EPIC'
}

function fillForRatio(ratio: number): string {
  if (ratio <= 0.25) return 'reveal-bar__fill--cool'
  if (ratio <= 0.5)  return 'reveal-bar__fill--mid'
  if (ratio <= 0.75) return 'reveal-bar__fill--warm'
  return 'reveal-bar__fill--hot'
}

interface BarProps {
  entry: VoteEntry
  index: number
  totalActive: number
  isScrumMaster: boolean
  reopening: boolean
  onReopen: (playerId: string) => void
}

function Bar({ entry, index, totalActive, isScrumMaster, reopening, onReopen }: BarProps) {
  const { dict } = useI18n()
  const tr = dict.room.reveal
  const isMissing = entry.value === null
  const isUnknown = entry.value === '?' || entry.value === '☕'
  const ratio = totalActive <= 1
    ? 0
    : ((entry.scaleIndex ?? 0)) / Math.max(1, totalActive - 1)
  const heightPercent = isMissing || isUnknown
    ? 18
    : Math.max(12, ((entry.scaleIndex ?? 0) + 1) / totalActive * 100)
  const fillClass = isMissing || isUnknown ? '' : fillForRatio(ratio)
  const tier = !isMissing && !isUnknown ? tierForRatio(ratio) : null
  const delay = 0.25 + index * 0.12

  const variant = isMissing
    ? 'reveal-bar--missing'
    : isUnknown
    ? 'reveal-bar--unknown'
    : entry.isOutlier
    ? 'reveal-bar--outlier'
    : ''

  const canReopen = isScrumMaster && !isMissing

  return (
    <div className={`reveal-bar ${variant}`}>
      <div className="reveal-bar__column">
        <div
          className="reveal-bar__token"
          style={{
            bottom: `calc(${heightPercent}% - 4px)`,
            animationDelay: `${delay + 0.45}s`,
          }}
        >
          <div className="reveal-bar__token-avatar">
            <Avatar name={entry.player.name} role="developer" emoji={entry.player.emoji} size="lg" />
          </div>
          <div className="reveal-bar__value">
            {isMissing ? '-' : entry.value}
          </div>
          {tier && <div className="reveal-bar__tier" data-tier={tier.toLowerCase()}>{tier}</div>}
          {entry.isOutlier && <div className="reveal-bar__outlier-flag">⚠️</div>}
        </div>

        <div
          className={`reveal-bar__fill ${fillClass}`}
          style={{
            height: `${heightPercent}%`,
            animationDelay: `${delay}s`,
          }}
        >
          <div className="reveal-bar__shine" />
        </div>
      </div>

      <div className="reveal-bar__name" title={entry.player.name}>
        {entry.player.name}
      </div>

      {canReopen && (
        <button
          type="button"
          className="reveal-bar__reopen"
          onClick={() => onReopen(entry.player.id)}
          disabled={reopening}
          title={fmt(tr.reopenAria, { name: entry.player.name })}
        >
          {reopening ? '…' : '↺'} {tr.reVote}
        </button>
      )}
    </div>
  )
}

export function RevealDashboard({ players, votes, round, roomId, isScrumMaster, scale, currentStory }: RevealDashboardProps) {
  const { dict } = useI18n()
  const tr = dict.room.reveal
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const { toast, showToast, clearToast } = useToast()

  const stats = computeRevealStats(scale, players, votes)
  const { entries, activeCount, mean, mode, min, max, consensus, outliers, questionCount, coffeeCount, missingCount } = stats
  const allOutliersTwoVoters = activeCount === 2 && outliers.length === 2

  const active = activeValues(scale)
  const isNum = isNumericScale(scale)
  const unit = localizedUnit(scale.unit, dict)
  // Stat principale : la moyenne si l'échelle est numérique, sinon le mode.
  const heroValue: string = isNum
    ? (mean !== null ? formatMean(mean) : '-')
    : (mode !== null ? String(mode) : '-')
  const heroLabel = isNum ? tr.mean : tr.majorityVote
  // JH : carte supérieure de l'échelle pour donner une estimation prudente
  const daysRoundUp = scale.unit === 'days' && mean !== null
    ? roundUpToScaleCard(scale, mean)
    : null

  // SM keeps the stories snapshot's mean/consensus in sync. We only write when
  // the stored row's values actually differ from what we just computed, that
  // way we never overwrite a freshly-set value (race with handleReveal) and
  // we still catch up after a re-vote.
  useEffect(() => {
    if (!isScrumMaster) return
    if (!currentStory) return
    const storedMean = currentStory.final_mean
    const meansEqual = (storedMean === null && mean === null)
      || (storedMean !== null && mean !== null && Math.abs(storedMean - mean) < 1e-9)
    if (meansEqual && currentStory.consensus === consensus) return
    const supabase = createClient()
    void supabase
      .from('stories')
      .update({ final_mean: mean, consensus })
      .eq('room_id', roomId)
      .eq('round', round)
      .then(({ error }) => {
        if (error) showToast(fmt(tr.syncTimeline, { msg: error.message }))
      })
  }, [isScrumMaster, mean, consensus, round, roomId, currentStory, showToast, tr])

  async function reopenVote(playerId: string) {
    if (!isScrumMaster || pendingId) return
    setPendingId(playerId)
    const supabase = createClient()
    const { error } = await supabase
      .from('votes')
      .update({ value: '' })
      .eq('room_id', roomId)
      .eq('player_id', playerId)
      .eq('round', round)
    if (error) {
      showToast(fmt(tr.reopenFailed, { msg: error.message }))
    }
    startTransition(() => setPendingId(null))
  }

  if (entries.length === 0) {
    return (
      <div className="card-surface">
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {tr.noDev}
        </p>
      </div>
    )
  }

  // Ligne de moyenne : uniquement pour les échelles numériques. Position
  // interpolée entre les deux cartes numériques qui encadrent la moyenne pour
  // que 6.5 se place entre les ticks 5 et 8 (pas snap sur l'un des deux).
  const meanPercent = (() => {
    if (!isNum || mean === null) return null
    const nums = numericValues(scale)
    if (nums.length === 0) return null
    if (mean <= nums[0]) return (1 / active.length) * 100
    if (mean >= nums[nums.length - 1]) return 100
    let lo = 0
    let hi = nums.length - 1
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] <= mean && mean <= nums[i + 1]) { lo = i; hi = i + 1; break }
    }
    const t = (mean - nums[lo]) / (nums[hi] - nums[lo])
    // Position de chaque carte numérique sur l'axe = son index dans `active`.
    const loActiveIdx = active.findIndex(v => v === nums[lo])
    const hiActiveIdx = active.findIndex(v => v === nums[hi])
    const idx = loActiveIdx + t * (hiActiveIdx - loActiveIdx)
    return ((idx + 1) / active.length) * 100
  })()

  const needsDiscussion = (consensus === 'discuss' || consensus === 'divergent') && outliers.length > 0

  return (
    <div key={`round-${round}`} className="reveal-dashboard">
      <header className="reveal-dashboard__header">
        <span className="reveal-dashboard__eyebrow">{fmt(tr.resultsEyebrow, { round })}</span>
        <h2 className="reveal-dashboard__title">{tr.scoreboard}</h2>
      </header>

      <div className="reveal-hero">
        <div className="reveal-mean-hero" data-consensus={consensus}>
          <div className="reveal-mean-hero__value">
            {heroValue}
            {unit && heroValue !== '-' && <span className="reveal-mean-hero__unit"> {unit}</span>}
          </div>
          <div className="reveal-mean-hero__label">{heroLabel}</div>
          {daysRoundUp !== null && (
            <div className="reveal-mean-hero__hint">
              {tr.topCard} <strong>{daysRoundUp} {unit}</strong>
            </div>
          )}
        </div>

        <div className="reveal-hero__stats">
          <ConsensusBadge level={consensus} />
          {min !== null && max !== null && (
            <div className="reveal-stat-row">
              <Stat label={tr.min} value={String(min)} />
              <span className="reveal-stat-divider">→</span>
              <Stat label={tr.max} value={String(max)} />
            </div>
          )}
          <div className="reveal-stat-row reveal-stat-row--small">
            <Stat label={tr.voters} value={String(activeCount)} />
            {questionCount > 0 && <Stat label={tr.undecided} value={String(questionCount)} />}
            {coffeeCount > 0 && <Stat label={tr.coffee} value={String(coffeeCount)} />}
            {missingCount > 0 && <Stat label={tr.notVoted} value={String(missingCount)} />}
          </div>
        </div>
      </div>

      <div className="reveal-chart">
        <div className="reveal-chart__axis" aria-hidden>
          {[...active].reverse().map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="reveal-chart__axis-tick"
              style={{ bottom: `${((active.length - i) / active.length) * 100}%` }}
            >
              {String(n)}
            </span>
          ))}
        </div>

        <div className="reveal-chart__bars">
          {meanPercent !== null && mean !== null && (
            <div className="reveal-chart__mean-line" style={{ bottom: `${meanPercent}%` }}>
              <span
                className="reveal-chart__mean-marker"
                title={fmt(tr.meanTooltip, { value: `${formatMean(mean)}${unit ? ` ${unit}` : ''}` })}
                aria-label={fmt(tr.meanTooltip, { value: `${formatMean(mean)}${unit ? ` ${unit}` : ''}` })}
              >
                M
              </span>
            </div>
          )}
          {entries.map((e, i) => (
            <Bar
              key={e.player.id}
              entry={e}
              index={i}
              totalActive={active.length}
              isScrumMaster={isScrumMaster}
              reopening={pendingId === e.player.id}
              onReopen={reopenVote}
            />
          ))}
        </div>
      </div>

      {needsDiscussion && (
        <div className="reveal-discussion-banner" data-level={consensus}>
          <div className="reveal-discussion-banner__icon">💬</div>
          <div className="reveal-discussion-banner__body">
            <strong>{consensus === 'divergent' ? tr.discussNeeded : tr.exchangeRecommended}</strong>
            <p>
              {allOutliersTwoVoters ? (
                <>
                  {tr.bothDivergeLead}{' '}
                  {outliers.map((o, i) => (
                    <span key={o.player.id}>
                      <span aria-hidden>{o.player.emoji ?? ''} </span>
                      <span className="reveal-discussion-banner__name">{o.player.name}</span> (<strong>{o.value}</strong>)
                      {i < outliers.length - 1 ? tr.and : ''}
                    </span>
                  ))}
                  {tr.bothDivergeEnd}
                </>
              ) : outliers.length === 1 ? (
                <>
                  <span aria-hidden>{outliers[0].player.emoji ?? ''} </span>
                  <span className="reveal-discussion-banner__name">{outliers[0].player.name}</span> {tr.singleOutlierEstimated} <strong>{outliers[0].value}</strong> {isNum ? tr.singleOutlierMeanIs : tr.singleOutlierMajorityIs} <strong>{heroValue}{unit ? ` ${unit}` : ''}</strong>{tr.singleOutlierEnd}
                </>
              ) : (
                <>
                  {outliers.map((o, i) => (
                    <span key={o.player.id}>
                      <span aria-hidden>{o.player.emoji ?? ''} </span>
                      <span className="reveal-discussion-banner__name">{o.player.name}</span> ({o.value}){i < outliers.length - 1 ? ', ' : ''}
                    </span>
                  ))} {isNum ? tr.multiOutlierMean : tr.multiOutlierMajority} <strong>{heroValue}{unit ? ` ${unit}` : ''}</strong>{tr.multiOutlierEnd}
                </>
              )}
            </p>

            {isScrumMaster && (
              <div className="reveal-discussion-banner__actions">
                <span className="reveal-discussion-banner__cta">
                  {allOutliersTwoVoters ? tr.reopenCtaMulti : tr.reopenCtaSingle}
                </span>
                <div className="reveal-discussion-banner__chips">
                  {outliers.map(o => (
                    <button
                      key={o.player.id}
                      type="button"
                      className="reveal-reopen-chip"
                      data-level={consensus}
                      onClick={() => reopenVote(o.player.id)}
                      disabled={pendingId === o.player.id}
                    >
                      <span aria-hidden>{o.player.emoji ?? '↺'}</span>
                      <span>{tr.reopenVoteOf} <strong>{o.player.name}</strong></span>
                      {pendingId === o.player.id && <span aria-hidden>…</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {consensus === 'perfect' && (
        <div className="reveal-discussion-banner" data-level="perfect">
          <div className="reveal-discussion-banner__icon">🎯</div>
          <div className="reveal-discussion-banner__body">
            <strong>{tr.perfectTitle}</strong>
            <p>{tr.perfectBody}</p>
          </div>
        </div>
      )}

      {isScrumMaster && !needsDiscussion && entries.some(e => e.value !== null) && (
        <p className="reveal-reopen-hint">
          {tr.reopenHint}
        </p>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}

function ConsensusBadge({ level }: { level: ConsensusLevel }) {
  const { dict } = useI18n()
  const c = dict.room.consensus[level]
  return (
    <div className="reveal-consensus-badge" data-level={level}>
      <span className="reveal-consensus-badge__icon">{consensusIcon(level)}</span>
      <span className="reveal-consensus-badge__label">{c.label}</span>
      <span className="reveal-consensus-badge__hint">{c.hint}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="reveal-stat">
      <span className="reveal-stat__value">{value}</span>
      <span className="reveal-stat__label">{label}</span>
    </div>
  )
}
