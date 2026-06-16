'use client'
import { formatMean, consensusIcon } from '@/lib/game/reveal-stats'
import { formatDuration } from '@/lib/game/session-stats'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'
import type { Story, ConsensusLevel } from '@/types'

interface StoryTimelineProps {
  stories: Story[]
  liveRound: number
  livePhase: 'waiting' | 'voting' | 'revealed'
  liveStory: string
  viewingRound: number | null
  /** Bascule la vue historique locale du SM. round === liveRound → null (sortie). */
  onSelect: (round: number | null) => void
}

const CONSENSUS_TINT: Record<ConsensusLevel, { bar: string; ring: string }> = {
  perfect:   { bar: '#3fb88e', ring: 'rgba(63,184,142,0.45)' },
  aligned:   { bar: '#4970ff', ring: 'rgba(73,112,255,0.45)' },
  discuss:   { bar: '#ffb24d', ring: 'rgba(255,178,77,0.55)' },
  divergent: { bar: '#ff5e7e', ring: 'rgba(255,94,126,0.55)' },
  empty:     { bar: '#a0a8c0', ring: 'rgba(160,168,192,0.40)' },
}

export function StoryTimeline({ stories, liveRound, livePhase, liveStory, viewingRound, onSelect }: StoryTimelineProps) {
  const { dict } = useI18n()
  const tt = dict.room.timeline
  const short = dict.room.consensusShort
  // Build the displayable list: every revealed story, plus a virtual "current"
  // item for the live round when it's not yet revealed (so the SM always sees
  // where they are).
  const liveAlreadySnapshotted = stories.some(s => s.round === liveRound)
  const currentVirtual = !liveAlreadySnapshotted
    ? {
        round: liveRound,
        title: liveStory || tt.roundInProgress,
        final_mean: null as number | null,
        consensus: null as ConsensusLevel | null,
        votingSeconds: null as number | null,
        isLive: true,
        isPending: livePhase !== 'revealed',
      }
    : null

  const items = [
    ...stories.map(s => ({
      round: s.round,
      title: s.title || tt.titleLost,
      final_mean: s.final_mean,
      consensus: s.consensus as ConsensusLevel | null,
      votingSeconds: s.voting_seconds,
      isLive: s.round === liveRound,
      isPending: false,
    })),
    ...(currentVirtual ? [currentVirtual] : []),
  ].sort((a, b) => b.round - a.round) // plus récent en haut

  function openStory(round: number) {
    // Navigation strictement locale au SM. Cliquer le round live = sortie de
    // la vue historique. Aucune écriture en base, aucun broadcast.
    onSelect(round === liveRound ? null : round)
  }

  return (
    <aside className="story-timeline" aria-label={tt.title}>
      <header className="story-timeline__header">
        <span className="story-timeline__eyebrow">{tt.eyebrow}</span>
        <h3 className="story-timeline__title">{tt.title}</h3>
        <p className="story-timeline__hint">
          {tt.hint}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="story-timeline__empty">{tt.empty}</p>
      ) : (
        <ol className="story-timeline__list">
          {items.map((item, idx) => {
            const isActive = viewingRound === null
              ? item.isLive
              : item.round === viewingRound
            const tint = item.consensus ? CONSENSUS_TINT[item.consensus] : null
            const meanText = item.final_mean !== null && item.final_mean !== undefined
              ? formatMean(item.final_mean)
              : item.isPending
                ? '…'
                : '-'

            return (
              <li key={item.round} className="story-timeline__item-wrap">
                {idx > 0 && <span className="story-timeline__connector" aria-hidden />}
                <button
                  type="button"
                  className={`story-timeline__item${isActive ? ' is-active' : ''}${item.isPending ? ' is-pending' : ''}`}
                  onClick={() => openStory(item.round)}
                  title={item.isPending
                    ? fmt(tt.pendingTitle, { round: item.round })
                    : fmt(tt.itemTitle, { round: item.round, title: item.title })}
                  data-consensus={item.consensus ?? 'empty'}
                  style={tint ? { ['--timeline-tint' as string]: tint.bar, ['--timeline-ring' as string]: tint.ring } : undefined}
                >
                  <div className="story-timeline__item-head">
                    <span className="story-timeline__rank" aria-label={`Round ${item.round}`}>
                      #{item.round}
                    </span>
                    <span
                      className="story-timeline__dot"
                      aria-hidden
                      title={item.consensus ? short[item.consensus] : (item.isPending ? tt.pendingDot : tt.emptyDot)}
                    />
                    {item.isLive && !item.isPending && (
                      <span className="story-timeline__live-pill">{tt.live}</span>
                    )}
                    {item.isPending && (
                      <span className="story-timeline__live-pill story-timeline__live-pill--pending">{tt.pending}</span>
                    )}
                  </div>

                  <div className="story-timeline__story" title={item.title}>
                    {item.title}
                  </div>

                  <div className="story-timeline__meta">
                    <span className="story-timeline__mean">
                      <span className="story-timeline__mean-value">{meanText}</span>
                      <span className="story-timeline__mean-label">{tt.mean}</span>
                    </span>
                    {item.consensus && (
                      <span className="story-timeline__consensus" data-consensus={item.consensus}>
                        {consensusIcon(item.consensus)} {short[item.consensus]}
                      </span>
                    )}
                    {item.votingSeconds !== null && item.votingSeconds !== undefined && (
                      <span className="story-timeline__time" title={tt.timeTitle}>
                        ⏱ {formatDuration(item.votingSeconds)}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      )}

      {viewingRound !== null && (
        <div className="story-timeline__active-hint">
          {tt.activeView} <strong>{fmt(tt.activeRound, { round: viewingRound })}</strong>
        </div>
      )}
    </aside>
  )
}
