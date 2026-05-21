'use client'
import { Avatar } from '@/components/ui/Avatar'
import {
  computeRevealStats,
  consensusHint,
  consensusIcon,
  consensusLabel,
  formatMean,
  type ConsensusLevel,
  type VoteEntry,
} from '@/lib/game/reveal-stats'
import type { Player, Vote } from '@/types'

interface RevealDashboardProps {
  players: Player[]
  votes: Vote[]
  round: number
}

function tileVariant(e: VoteEntry): string {
  if (e.value === null) return 'reveal-vote-tile reveal-vote-tile--missing'
  if (e.value === '?') return 'reveal-vote-tile reveal-vote-tile--unknown'
  if (e.isOutlier) return 'reveal-vote-tile reveal-vote-tile--far'
  const d = e.fibDistance ?? 0
  if (d === 0) return 'reveal-vote-tile reveal-vote-tile--aligned'
  if (d === 1) return 'reveal-vote-tile reveal-vote-tile--close'
  return 'reveal-vote-tile reveal-vote-tile--off'
}

export function RevealDashboard({ players, votes, round }: RevealDashboardProps) {
  const stats = computeRevealStats(players, votes)
  const { entries, numericCount, mean, min, max, consensus, outliers, questionCount, missingCount } = stats

  if (entries.length === 0) {
    return (
      <div className="card-surface">
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Aucun développeur pour ce round.
        </p>
      </div>
    )
  }

  // Re-key on round so animations replay each reveal.
  const animKey = `round-${round}`

  return (
    <div key={animKey} className="reveal-dashboard">
      <header className="reveal-dashboard__header">
        <span className="reveal-dashboard__eyebrow">Résultats — Round {round}</span>
        <h2 className="reveal-dashboard__title">Votes révélés</h2>
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

      <div className="reveal-vote-grid">
        {entries.map((e, i) => (
          <article
            key={e.player.id}
            className={tileVariant(e)}
            style={{ animationDelay: `${0.18 + i * 0.08}s` }}
          >
            <div className="reveal-vote-tile__avatar">
              <Avatar name={e.player.name} role="developer" />
            </div>
            <div className="reveal-vote-tile__name">{e.player.name}</div>
            <div className="reveal-vote-tile__value">
              {e.value === null ? '—' : e.value}
            </div>
            <div className="reveal-vote-tile__hint">
              {e.value === null ? 'pas voté'
                : e.value === '?' ? 'indécis'
                : e.isOutlier ? '⚠️ écart fort'
                : (e.fibDistance ?? 0) === 0 ? '✓ aligné'
                : (e.fibDistance ?? 0) === 1 ? 'proche'
                : 'éloigné'}
            </div>
          </article>
        ))}
      </div>

      {(consensus === 'discuss' || consensus === 'divergent') && outliers.length > 0 && (
        <div className="reveal-discussion-banner" data-level={consensus}>
          <div className="reveal-discussion-banner__icon">💬</div>
          <div className="reveal-discussion-banner__body">
            <strong>{consensus === 'divergent' ? 'Discussion nécessaire' : 'Échange recommandé'}</strong>
            <p>
              {outliers.length === 1
                ? <><span className="reveal-discussion-banner__name">{outliers[0].player.name}</span> a estimé <strong>{outliers[0].value}</strong> alors que la moyenne est <strong>{mean !== null ? formatMean(mean) : '—'}</strong>.</>
                : <>
                    {outliers.map((o, i) => (
                      <span key={o.player.id}>
                        <span className="reveal-discussion-banner__name">{o.player.name}</span> ({o.value}){i < outliers.length - 1 ? ', ' : ''}
                      </span>
                    ))} sortent du lot par rapport à la moyenne <strong>{mean !== null ? formatMean(mean) : '—'}</strong>.
                  </>}
              {' '}Prenez un instant pour comprendre les hypothèses différentes avant de re-voter.
            </p>
          </div>
        </div>
      )}

      {consensus === 'perfect' && (
        <div className="reveal-discussion-banner" data-level="perfect">
          <div className="reveal-discussion-banner__icon">🎯</div>
          <div className="reveal-discussion-banner__body">
            <strong>Consensus parfait !</strong>
            <p>Tout le monde est sur la même longueur d&apos;onde. Direction le prochain ticket.</p>
          </div>
        </div>
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
