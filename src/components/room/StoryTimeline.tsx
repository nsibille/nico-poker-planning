'use client'
import { formatMean, consensusIcon } from '@/lib/game/reveal-stats'
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

const CONSENSUS_TINT: Record<ConsensusLevel, { bar: string; ring: string; label: string }> = {
  perfect:   { bar: '#3fb88e', ring: 'rgba(63,184,142,0.45)',  label: 'Parfait' },
  aligned:   { bar: '#4970ff', ring: 'rgba(73,112,255,0.45)',  label: 'Aligné' },
  discuss:   { bar: '#ffb24d', ring: 'rgba(255,178,77,0.55)',  label: 'À discuter' },
  divergent: { bar: '#ff5e7e', ring: 'rgba(255,94,126,0.55)',  label: 'Divergent' },
  empty:     { bar: '#a0a8c0', ring: 'rgba(160,168,192,0.40)', label: 'Aucun vote' },
}

export function StoryTimeline({ stories, liveRound, livePhase, liveStory, viewingRound, onSelect }: StoryTimelineProps) {
  // Build the displayable list: every revealed story, plus a virtual "current"
  // item for the live round when it's not yet revealed (so the SM always sees
  // where they are).
  const liveAlreadySnapshotted = stories.some(s => s.round === liveRound)
  const currentVirtual = !liveAlreadySnapshotted
    ? {
        round: liveRound,
        title: liveStory || 'Round en cours',
        final_mean: null as number | null,
        consensus: null as ConsensusLevel | null,
        isLive: true,
        isPending: livePhase !== 'revealed',
      }
    : null

  const items = [
    ...stories.map(s => ({
      round: s.round,
      title: s.title || '(titre perdu)',
      final_mean: s.final_mean,
      consensus: s.consensus as ConsensusLevel | null,
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
    <aside className="story-timeline" aria-label="Historique des stories">
      <header className="story-timeline__header">
        <span className="story-timeline__eyebrow">Scrum Master</span>
        <h3 className="story-timeline__title">Timeline</h3>
        <p className="story-timeline__hint">
          Navigation locale, clique pour consulter un round passé sans déranger les participants.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="story-timeline__empty">Aucune story révélée pour l&apos;instant.</p>
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
                    ? `Round ${item.round} en cours, clique pour revenir au round courant`
                    : `Round ${item.round}, ${item.title}`}
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
                      title={tint?.label ?? (item.isPending ? 'En cours' : 'Aucun vote')}
                    />
                    {item.isLive && !item.isPending && (
                      <span className="story-timeline__live-pill">live</span>
                    )}
                    {item.isPending && (
                      <span className="story-timeline__live-pill story-timeline__live-pill--pending">en cours</span>
                    )}
                  </div>

                  <div className="story-timeline__story" title={item.title}>
                    {item.title}
                  </div>

                  <div className="story-timeline__meta">
                    <span className="story-timeline__mean">
                      <span className="story-timeline__mean-value">{meanText}</span>
                      <span className="story-timeline__mean-label">moy.</span>
                    </span>
                    {item.consensus && (
                      <span className="story-timeline__consensus" data-consensus={item.consensus}>
                        {consensusIcon(item.consensus)} {tint?.label}
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
          Vue active : <strong>round {viewingRound}</strong>
        </div>
      )}
    </aside>
  )
}
