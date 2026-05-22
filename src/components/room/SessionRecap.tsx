'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Avatar } from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { computeSessionStats } from '@/lib/game/session-stats'
import { formatMean, consensusLabel, consensusIcon } from '@/lib/game/reveal-stats'
import type { EstimationScale } from '@/lib/game/scales'
import type { Player, Vote, Story, ConsensusLevel } from '@/types'

interface SessionRecapProps {
  roomId: string
  players: Player[]
  stories: Story[]
  endedAt: string
  scale: EstimationScale
}

export function SessionRecap({ roomId, players, stories, endedAt, scale }: SessionRecapProps) {
  const router = useRouter()
  const { myPlayerId, myRole, reset } = useGameStore()
  const [allVotes, setAllVotes] = useState<Vote[] | null>(null)

  // Fetch every vote ever cast in this room (frozen data, fetch once).
  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    void (async () => {
      const { data } = await supabase
        .from('votes')
        .select('*')
        .eq('room_id', roomId)
      if (!cancelled) setAllVotes((data ?? []) as Vote[])
    })()
    return () => { cancelled = true }
  }, [roomId])

  // Big celebratory confetti burst on mount, orchestrated to land just as the
  // "Session terminée" title appears.
  useEffect(() => {
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 220,
        spread: 110,
        startVelocity: 45,
        origin: { y: 0.35 },
        colors: ['#4970ff', '#ffb24d', '#a8e0e5', '#9485f2', '#ff7f66'],
      })
    }, 250)
    const t2 = setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#4970ff', '#ffb24d', '#a8e0e5'],
      })
      confetti({
        particleCount: 120,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ['#9485f2', '#ff7f66', '#64c1fa'],
      })
    }, 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [endedAt])

  async function handleLeave() {
    if (myPlayerId) {
      const supabase = createClient()
      await supabase.from('players').delete().eq('id', myPlayerId).then(() => {}, () => {})
    }
    reset()
    router.push('/app')
  }

  if (!allVotes) {
    return (
      <div className="session-recap session-recap--loading">
        <div className="session-recap__loading-pulse">Compilation des résultats…</div>
      </div>
    )
  }

  const stats = computeSessionStats(scale, players, allVotes, stories)
  const { perPlayer, globalMean, totalStoryPoints, storiesCount, perfectConsensusCount,
    divergentCount, mostContested, mostUnanimous, awards } = stats
  const isScrumMaster = myRole === 'scrum-master'

  // Sort players by alignment (ascending, most aligned first) for the leaderboard.
  const ranked = [...perPlayer]
    .filter(p => p.numericVotes > 0)
    .sort((a, b) => {
      const aa = a.alignmentScore ?? Infinity
      const bb = b.alignmentScore ?? Infinity
      return aa - bb
    })

  return (
    <div className="session-recap">
      <header className="session-recap__hero">
        <div className="session-recap__hero-eyebrow">Session #{roomId}</div>
        <h1 className="session-recap__title">
          <span className="session-recap__title-word session-recap__title-word--1">Session</span>{' '}
          <span className="session-recap__title-word session-recap__title-word--2">terminée</span>
          <span className="session-recap__title-emoji">🎉</span>
        </h1>
        <p className="session-recap__subtitle">
          {storiesCount} stor{storiesCount > 1 ? 'ies' : 'y'} estimée{storiesCount > 1 ? 's' : ''} ·{' '}
          {players.filter(p => p.role === 'developer').length} dev{players.filter(p => p.role === 'developer').length > 1 ? 's' : ''} ·{' '}
          terminée par le Scrum Master
        </p>
      </header>

      <section className="session-recap__big-stats">
        <BigStat
          delay={0.6}
          label="Stories"
          value={String(storiesCount)}
          accent="indigo"
          hint={storiesCount > 1 ? 'rounds joués' : 'round joué'}
        />
        <BigStat
          delay={0.8}
          label="Story points"
          value={totalStoryPoints.toFixed(0)}
          accent="brand"
          hint="Total estimé"
        />
        <BigStat
          delay={1.0}
          label="Complexité moy."
          value={globalMean !== null ? formatMean(globalMean) : '-'}
          accent="indigo"
          hint="par story"
        />
        <BigStat
          delay={1.2}
          label="🎯 Consensus parfait"
          value={String(perfectConsensusCount)}
          accent="success"
          hint={perfectConsensusCount === storiesCount && storiesCount > 0
            ? 'sans-faute !'
            : perfectConsensusCount > 1 ? 'rounds' : 'round'}
        />
        <BigStat
          delay={1.4}
          label="⚠️ Divergents"
          value={String(divergentCount)}
          accent={divergentCount > 0 ? 'danger' : 'muted'}
          hint={divergentCount > 0 ? 'à débriefer' : 'aucun'}
        />
      </section>

      {awards.length > 0 && (
        <section className="session-recap__section">
          <h2 className="session-recap__section-title">
            <span aria-hidden>🏆</span> Awards de la session
          </h2>
          <div className="session-recap__awards">
            {awards.map((a, i) => (
              <article
                key={a.id}
                className="award-card"
                style={{ animationDelay: `${1.6 + i * 0.18}s` }}
                data-award={a.id}
              >
                <div className="award-card__icon">{a.icon}</div>
                <div className="award-card__body">
                  <div className="award-card__title">{a.title}</div>
                  <div className="award-card__subtitle">{a.subtitle}</div>
                  <div className="award-card__player">
                    <Avatar name={a.player.name} role={a.player.role} emoji={a.player.emoji} size="sm" />
                    <span className="award-card__player-name" title={a.player.name}>{a.player.name}</span>
                    {a.value && <span className="award-card__value">{a.value}</span>}
                  </div>
                </div>
                <div className="award-card__shine" aria-hidden />
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="session-recap__section">
        <h2 className="session-recap__section-title">
          <span aria-hidden>📊</span> Classement par alignement
        </h2>
        <div className="session-recap__leaderboard">
          {ranked.length === 0 ? (
            <p className="session-recap__empty">Aucun dev n&apos;a voté cette session.</p>
          ) : ranked.map((p, i) => {
            const isMe = p.player.id === myPlayerId
            const rank = i + 1
            return (
              <div
                key={p.player.id}
                className={`player-row${isMe ? ' player-row--me' : ''}`}
                style={{ animationDelay: `${2.8 + i * 0.12}s` }}
                data-rank={rank}
              >
                <div className="player-row__rank">
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>
                <div className="player-row__avatar">
                  <Avatar name={p.player.name} role={p.player.role} emoji={p.player.emoji} size="lg" />
                </div>
                <div className="player-row__identity">
                  <div className="player-row__name">{p.player.name}{isMe && <span className="player-row__me-tag">toi</span>}</div>
                  <div className="player-row__sub">
                    {p.numericVotes} vote{p.numericVotes > 1 ? 's' : ''}
                    {p.questionVotes > 0 && <> · {p.questionVotes} × «&nbsp;?&nbsp;»</>}
                    {p.missing > 0 && <> · {p.missing} absent{p.missing > 1 ? 's' : ''}</>}
                  </div>
                </div>
                <div className="player-row__metric">
                  <div className="player-row__metric-value">
                    {p.averageGiven !== null ? formatMean(p.averageGiven) : '-'}
                  </div>
                  <div className="player-row__metric-label">moy. donnée</div>
                </div>
                <div className="player-row__metric">
                  <div className="player-row__metric-value">
                    {p.alignmentScore !== null
                      ? (p.alignmentScore === 0 ? '🎯' : `Δ${p.alignmentScore.toFixed(2)}`)
                      : '-'}
                  </div>
                  <div className="player-row__metric-label">alignement</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {(mostContested || mostUnanimous) && (
        <section className="session-recap__section">
          <h2 className="session-recap__section-title">
            <span aria-hidden>🔥</span> Highlights
          </h2>
          <div className="session-recap__highlights">
            {mostUnanimous && (
              <HighlightCard
                delay={4.0}
                icon="🤝"
                label="La plus consensuelle"
                story={mostUnanimous}
                tone="success"
              />
            )}
            {mostContested && mostContested.round !== mostUnanimous?.round && (
              <HighlightCard
                delay={4.2}
                icon="💥"
                label="La plus chaude"
                story={mostContested}
                tone="danger"
              />
            )}
          </div>
        </section>
      )}

      <section className="session-recap__section">
        <h2 className="session-recap__section-title">
          <span aria-hidden>🃏</span> Toutes les stories
        </h2>
        <ol className="session-recap__stories">
          {[...stories].sort((a, b) => a.round - b.round).map((s, i) => (
            <li
              key={s.round}
              className="recap-story"
              style={{ animationDelay: `${4.6 + i * 0.08}s` }}
              data-consensus={s.consensus ?? 'empty'}
            >
              <span className="recap-story__rank">#{s.round}</span>
              <span className="recap-story__title">{s.title || <em>(titre perdu)</em>}</span>
              <span className="recap-story__consensus">
                {consensusIcon((s.consensus ?? 'empty') as ConsensusLevel)}{' '}
                {consensusLabel((s.consensus ?? 'empty') as ConsensusLevel)}
              </span>
              <span className="recap-story__mean">
                {s.final_mean !== null && s.final_mean !== undefined
                  ? formatMean(s.final_mean)
                  : '-'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="session-recap__footer">
        {isScrumMaster && (
          <ResumeSessionButton roomId={roomId} />
        )}
        <button type="button" onClick={handleLeave} className="btn-primary-md">
          Quitter la session
        </button>
      </footer>
    </div>
  )
}

function BigStat({ label, value, hint, accent, delay }: { label: string; value: string; hint?: string; accent: 'brand' | 'indigo' | 'success' | 'danger' | 'muted'; delay: number }) {
  return (
    <div className="big-stat" data-accent={accent} style={{ animationDelay: `${delay}s` }}>
      <div className="big-stat__value">{value}</div>
      <div className="big-stat__label">{label}</div>
      {hint && <div className="big-stat__hint">{hint}</div>}
    </div>
  )
}

function HighlightCard({ icon, label, story, tone, delay }: { icon: string; label: string; story: Story; tone: 'success' | 'danger'; delay: number }) {
  return (
    <div className="highlight-card" data-tone={tone} style={{ animationDelay: `${delay}s` }}>
      <div className="highlight-card__icon">{icon}</div>
      <div className="highlight-card__label">{label}</div>
      <div className="highlight-card__title">#{story.round}, {story.title || '(titre perdu)'}</div>
      <div className="highlight-card__meta">
        Consensus : <strong>{consensusLabel((story.consensus ?? 'empty') as ConsensusLevel)}</strong>
        {story.final_mean !== null && story.final_mean !== undefined && <> · moy. <strong>{formatMean(story.final_mean)}</strong></>}
      </div>
    </div>
  )
}

function ResumeSessionButton({ roomId }: { roomId: string }) {
  const [busy, setBusy] = useState(false)
  async function resume() {
    if (busy) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('rooms').update({ ended_at: null }).eq('id', roomId)
    setBusy(false)
  }
  return (
    <button type="button" onClick={resume} disabled={busy} className="btn-secondary-md">
      {busy ? '…' : '↶ Reprendre la session'}
    </button>
  )
}
