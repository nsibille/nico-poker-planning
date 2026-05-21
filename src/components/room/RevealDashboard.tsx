'use client'
import { useState, useTransition } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import {
  computeRevealStats,
  consensusHint,
  consensusIcon,
  consensusLabel,
  formatMean,
  FIB_NUMERIC,
  type ConsensusLevel,
  type VoteEntry,
} from '@/lib/game/reveal-stats'
import type { Player, Vote } from '@/types'

interface RevealDashboardProps {
  players: Player[]
  votes: Vote[]
  round: number
  roomId: string
  isScrumMaster: boolean
}

function barFillForValue(value: number): string {
  if (value <= 2)  return 'reveal-bar__fill--cool'    // 1, 2 — green
  if (value <= 5)  return 'reveal-bar__fill--mid'     // 3, 5 — teal/blue
  if (value <= 8)  return 'reveal-bar__fill--warm'    // 8 — amber
  return 'reveal-bar__fill--hot'                       // 13, 21 — coral
}

function tierLabel(value: number): string {
  if (value <= 2)  return 'EASY'
  if (value <= 5)  return 'MEDIUM'
  if (value <= 8)  return 'HARD'
  return 'EPIC'
}

interface BarProps {
  entry: VoteEntry
  index: number
  isScrumMaster: boolean
  reopening: boolean
  onReopen: (playerId: string) => void
}

function Bar({ entry, index, isScrumMaster, reopening, onReopen }: BarProps) {
  const isMissing = entry.value === null
  const isUnknown = entry.value === '?'
  const numeric = entry.numeric ?? 0
  const heightPercent = isMissing || isUnknown
    ? 18
    : Math.max(12, ((entry.fibIndex ?? 0) + 1) / FIB_NUMERIC.length * 100)
  const fillClass = isMissing || isUnknown ? '' : barFillForValue(numeric)
  const tier = !isMissing && !isUnknown ? tierLabel(numeric) : null
  const delay = 0.25 + index * 0.12

  const variant = isMissing
    ? 'reveal-bar--missing'
    : isUnknown
    ? 'reveal-bar--unknown'
    : entry.isOutlier
    ? 'reveal-bar--outlier'
    : ''

  // SM can re-open only players who already cast a value — re-opening a missing
  // player is a no-op since they have nothing to clear.
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
            {isMissing ? '—' : entry.value}
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
          title={`Réouvrir le vote de ${entry.player.name}`}
        >
          {reopening ? '…' : '↺'} Re-voter
        </button>
      )}
    </div>
  )
}

export function RevealDashboard({ players, votes, round, roomId, isScrumMaster }: RevealDashboardProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const stats = computeRevealStats(players, votes)
  const { entries, numericCount, mean, min, max, consensus, outliers, questionCount, missingCount } = stats

  async function reopenVote(playerId: string) {
    if (!isScrumMaster || pendingId) return
    setPendingId(playerId)
    const supabase = createClient()
    await supabase
      .from('votes')
      .delete()
      .eq('room_id', roomId)
      .eq('player_id', playerId)
      .eq('round', round)
    startTransition(() => setPendingId(null))
  }

  if (entries.length === 0) {
    return (
      <div className="card-surface">
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Aucun développeur pour ce round.
        </p>
      </div>
    )
  }

  // Mean line position: interpolate between the two surrounding Fib rungs so a mean of 6.5
  // sits halfway between the "5" and "8" axis ticks instead of snapping to one of them.
  const meanPercent = (() => {
    if (mean === null) return null
    let lo = 0
    let hi = FIB_NUMERIC.length - 1
    for (let i = 0; i < FIB_NUMERIC.length - 1; i++) {
      if (FIB_NUMERIC[i] <= mean && mean <= FIB_NUMERIC[i + 1]) { lo = i; hi = i + 1; break }
    }
    if (mean <= FIB_NUMERIC[0]) return ((0 + 1) / FIB_NUMERIC.length) * 100
    if (mean >= FIB_NUMERIC[FIB_NUMERIC.length - 1]) return 100
    const t = (mean - FIB_NUMERIC[lo]) / (FIB_NUMERIC[hi] - FIB_NUMERIC[lo])
    const idx = lo + t
    return ((idx + 1) / FIB_NUMERIC.length) * 100
  })()

  const needsDiscussion = (consensus === 'discuss' || consensus === 'divergent') && outliers.length > 0

  return (
    <div key={`round-${round}`} className="reveal-dashboard">
      <header className="reveal-dashboard__header">
        <span className="reveal-dashboard__eyebrow">Résultats — Round {round}</span>
        <h2 className="reveal-dashboard__title">Scoreboard</h2>
      </header>

      <div className="reveal-hero">
        <div className="reveal-mean-hero" data-consensus={consensus}>
          <div className="reveal-mean-hero__value">{mean !== null ? formatMean(mean) : '—'}</div>
          <div className="reveal-mean-hero__label">Moyenne</div>
        </div>

        <div className="reveal-hero__stats">
          <ConsensusBadge level={consensus} />
          {mean !== null && (
            <div className="reveal-stat-row">
              <Stat label="Min" value={String(min)} />
              <span className="reveal-stat-divider">→</span>
              <Stat label="Max" value={String(max)} />
            </div>
          )}
          <div className="reveal-stat-row reveal-stat-row--small">
            <Stat label="Votants" value={String(numericCount)} />
            {questionCount > 0 && <Stat label="Indécis (?)" value={String(questionCount)} />}
            {missingCount > 0 && <Stat label="Pas voté" value={String(missingCount)} />}
          </div>
        </div>
      </div>

      <div className="reveal-chart">
        <div className="reveal-chart__axis" aria-hidden>
          {[...FIB_NUMERIC].reverse().map((n, i) => (
            <span
              key={n}
              className="reveal-chart__axis-tick"
              style={{ bottom: `${((FIB_NUMERIC.length - i) / FIB_NUMERIC.length) * 100}%` }}
            >
              {n}
            </span>
          ))}
        </div>

        <div className="reveal-chart__bars">
          {meanPercent !== null && (
            <div className="reveal-chart__mean-line" style={{ bottom: `${meanPercent}%` }}>
              <span className="reveal-chart__mean-label">Moy. {formatMean(mean as number)}</span>
            </div>
          )}
          {entries.map((e, i) => (
            <Bar
              key={e.player.id}
              entry={e}
              index={i}
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
            <strong>{consensus === 'divergent' ? 'Discussion nécessaire' : 'Échange recommandé'}</strong>
            <p>
              {outliers.length === 1
                ? <><span aria-hidden>{outliers[0].player.emoji ?? ''} </span><span className="reveal-discussion-banner__name">{outliers[0].player.name}</span> a estimé <strong>{outliers[0].value}</strong> alors que la moyenne est <strong>{mean !== null ? formatMean(mean) : '—'}</strong>.</>
                : <>
                    {outliers.map((o, i) => (
                      <span key={o.player.id}>
                        <span aria-hidden>{o.player.emoji ?? ''} </span>
                        <span className="reveal-discussion-banner__name">{o.player.name}</span> ({o.value}){i < outliers.length - 1 ? ', ' : ''}
                      </span>
                    ))} sortent du lot par rapport à la moyenne <strong>{mean !== null ? formatMean(mean) : '—'}</strong>.
                  </>}
              {' '}Prenez un instant pour comprendre les hypothèses avant de re-voter.
            </p>

            {isScrumMaster && (
              <div className="reveal-discussion-banner__actions">
                <span className="reveal-discussion-banner__cta">
                  Après échange, tu peux rouvrir le vote d&apos;un participant pour qu&apos;il ré-estime :
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
                      <span>Rouvrir le vote de <strong>{o.player.name}</strong></span>
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
            <strong>Consensus parfait !</strong>
            <p>Tout le monde est aligné. Direction le prochain ticket.</p>
          </div>
        </div>
      )}

      {isScrumMaster && !needsDiscussion && entries.some(e => e.value !== null) && (
        <p className="reveal-reopen-hint">
          ↺ Besoin d&apos;ajuster ? Clique « Re-voter » sous un participant pour lui rouvrir son vote.
        </p>
      )}
    </div>
  )
}

function ConsensusBadge({ level }: { level: ConsensusLevel }) {
  return (
    <div className="reveal-consensus-badge" data-level={level}>
      <span className="reveal-consensus-badge__icon">{consensusIcon(level)}</span>
      <span className="reveal-consensus-badge__label">{consensusLabel(level)}</span>
      <span className="reveal-consensus-badge__hint">{consensusHint(level)}</span>
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
