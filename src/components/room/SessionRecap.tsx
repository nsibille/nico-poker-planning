'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Avatar } from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { useGameStore, useRoomSession } from '@/store/gameStore'
import { computeSessionStats, formatDuration } from '@/lib/game/session-stats'
import { formatMean, consensusIcon } from '@/lib/game/reveal-stats'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'
import type { Dictionary } from '@/lib/i18n/dict'
import type { EstimationScale } from '@/lib/game/scales'
import type { Player, Vote, Story, ConsensusLevel } from '@/types'

/** Libellé de consensus traduit, avec repli sur 'empty'. */
function consensusText(dict: Dictionary, level: ConsensusLevel | null | undefined): string {
  return dict.room.consensus[(level ?? 'empty') as ConsensusLevel].label
}

interface SessionRecapProps {
  roomId: string
  players: Player[]
  stories: Story[]
  endedAt: string
  scale: EstimationScale
}

export function SessionRecap({ roomId, players, stories, endedAt, scale }: SessionRecapProps) {
  const router = useRouter()
  const { dict } = useI18n()
  const tre = dict.room.recap
  const session = useRoomSession(roomId)
  const myPlayerId = session?.playerId ?? null
  const myRole = session?.role ?? null
  const { leaveRoom } = useGameStore()
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
    leaveRoom(roomId)
    router.push('/app')
  }

  if (!allVotes) {
    return (
      <div className="session-recap session-recap--loading">
        <div className="session-recap__loading-pulse">{tre.compiling}</div>
      </div>
    )
  }

  const stats = computeSessionStats(scale, players, allVotes, stories)
  const { perPlayer, globalMean, totalStoryPoints, storiesCount, perfectConsensusCount,
    divergentCount, mostContested, mostUnanimous, awards,
    totalVotingSeconds, averageVotingSeconds } = stats
  const isScrumMaster = myRole === 'scrum-master'
  const devCount = players.filter(p => p.role === 'developer').length

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
        <div className="session-recap__hero-eyebrow">{fmt(tre.session, { id: roomId })}</div>
        <h1 className="session-recap__title">
          <span className="session-recap__title-word session-recap__title-word--1">{tre.titleWord1}</span>{' '}
          <span className="session-recap__title-word session-recap__title-word--2">{tre.titleWord2}</span>
          <span className="session-recap__title-emoji">🎉</span>
        </h1>
        <p className="session-recap__subtitle">
          {fmt(tre.subtitle, {
            stories: fmt(storiesCount > 1 ? tre.storiesMany : tre.storiesOne, { n: storiesCount }),
            devs: fmt(devCount > 1 ? tre.devsMany : tre.devsOne, { n: devCount }),
          })}
        </p>
      </header>

      <section className="session-recap__big-stats">
        <BigStat
          delay={0.6}
          label={tre.statStories}
          value={String(storiesCount)}
          accent="indigo"
          hint={storiesCount > 1 ? tre.hintRoundsPlayedMany : tre.hintRoundsPlayedOne}
        />
        <BigStat
          delay={0.8}
          label={tre.statStoryPoints}
          value={totalStoryPoints.toFixed(0)}
          accent="brand"
          hint={tre.hintTotalEstimated}
        />
        <BigStat
          delay={1.0}
          label={tre.statComplexity}
          value={globalMean !== null ? formatMean(globalMean) : '-'}
          accent="indigo"
          hint={tre.hintPerStory}
        />
        <BigStat
          delay={1.2}
          label={tre.statPerfect}
          value={String(perfectConsensusCount)}
          accent="success"
          hint={perfectConsensusCount === storiesCount && storiesCount > 0
            ? tre.hintFlawless
            : perfectConsensusCount > 1 ? tre.hintRoundsMany : tre.hintRoundsOne}
        />
        <BigStat
          delay={1.4}
          label={tre.statDivergent}
          value={String(divergentCount)}
          accent={divergentCount > 0 ? 'danger' : 'muted'}
          hint={divergentCount > 0 ? tre.hintToDebrief : tre.hintNone}
        />
        {totalVotingSeconds !== null && (
          <BigStat
            delay={1.6}
            label={tre.statVotingTime}
            value={formatDuration(totalVotingSeconds)}
            accent="indigo"
            hint={averageVotingSeconds !== null
              ? fmt(tre.hintPerRound, { time: formatDuration(averageVotingSeconds) })
              : tre.hintCumulative}
          />
        )}
      </section>

      {awards.length > 0 && (
        <section className="session-recap__section">
          <h2 className="session-recap__section-title">{tre.awardsTitle}</h2>
          <div className="session-recap__awards">
            {awards.map((a, i) => {
              const meta = dict.room.awards[a.id as keyof typeof dict.room.awards]
              return (
              <article
                key={a.id}
                className="award-card"
                style={{ animationDelay: `${1.6 + i * 0.18}s` }}
                data-award={a.id}
              >
                <div className="award-card__icon">{a.icon}</div>
                <div className="award-card__body">
                  <div className="award-card__title">{meta?.title ?? a.id}</div>
                  <div className="award-card__subtitle">{meta?.subtitle ?? ''}</div>
                  <div className="award-card__player">
                    <Avatar name={a.player.name} role={a.player.role} emoji={a.player.emoji} size="sm" />
                    <span className="award-card__player-name" title={a.player.name}>{a.player.name}</span>
                    {a.value && <span className="award-card__value">{a.value}</span>}
                  </div>
                </div>
                <div className="award-card__shine" aria-hidden />
              </article>
              )
            })}
          </div>
        </section>
      )}

      <section className="session-recap__section">
        <h2 className="session-recap__section-title">{tre.leaderboardTitle}</h2>
        <div className="session-recap__leaderboard">
          {ranked.length === 0 ? (
            <p className="session-recap__empty">{tre.leaderboardEmpty}</p>
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
                  <div className="player-row__name">{p.player.name}{isMe && <span className="player-row__me-tag">{tre.you}</span>}</div>
                  <div className="player-row__sub">
                    {fmt(p.numericVotes > 1 ? tre.votesMany : tre.votesOne, { n: p.numericVotes })}
                    {p.questionVotes > 0 && <> · {fmt(tre.questionVotes, { n: p.questionVotes })}</>}
                    {p.missing > 0 && <> · {fmt(p.missing > 1 ? tre.missingMany : tre.missingOne, { n: p.missing })}</>}
                  </div>
                </div>
                <div className="player-row__metric">
                  <div className="player-row__metric-value">
                    {p.averageGiven !== null ? formatMean(p.averageGiven) : '-'}
                  </div>
                  <div className="player-row__metric-label">{tre.meanGiven}</div>
                </div>
                <div className="player-row__metric">
                  <div className="player-row__metric-value">
                    {p.alignmentScore !== null
                      ? (p.alignmentScore === 0 ? '🎯' : `Δ${p.alignmentScore.toFixed(2)}`)
                      : '-'}
                  </div>
                  <div className="player-row__metric-label">{tre.alignment}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {(mostContested || mostUnanimous) && (
        <section className="session-recap__section">
          <h2 className="session-recap__section-title">{tre.highlightsTitle}</h2>
          <div className="session-recap__highlights">
            {mostUnanimous && (
              <HighlightCard
                delay={4.0}
                icon="🤝"
                label={tre.mostConsensual}
                story={mostUnanimous}
                tone="success"
              />
            )}
            {mostContested && mostContested.round !== mostUnanimous?.round && (
              <HighlightCard
                delay={4.2}
                icon="💥"
                label={tre.mostHeated}
                story={mostContested}
                tone="danger"
              />
            )}
          </div>
        </section>
      )}

      <section className="session-recap__section">
        <h2 className="session-recap__section-title">{tre.allStoriesTitle}</h2>
        <ol className="session-recap__stories">
          {[...stories].sort((a, b) => a.round - b.round).map((s, i) => (
            <li
              key={s.round}
              className="recap-story"
              style={{ animationDelay: `${4.6 + i * 0.08}s` }}
              data-consensus={s.consensus ?? 'empty'}
            >
              <span className="recap-story__rank">#{s.round}</span>
              <span className="recap-story__title">{s.title || <em>{tre.titleLost}</em>}</span>
              <span className="recap-story__consensus">
                {consensusIcon((s.consensus ?? 'empty') as ConsensusLevel)}{' '}
                {consensusText(dict, s.consensus as ConsensusLevel | null)}
                {s.voting_seconds !== null && s.voting_seconds !== undefined && (
                  <span className="recap-story__time" title={dict.room.timeline.timeTitle}>
                    {' · ⏱ '}{formatDuration(s.voting_seconds)}
                  </span>
                )}
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
          <ResumeSessionButton roomId={roomId} label={tre.resume} />
        )}
        <button type="button" onClick={handleLeave} className="btn-primary-md">
          {tre.leave}
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
  const { dict } = useI18n()
  const tre = dict.room.recap
  return (
    <div className="highlight-card" data-tone={tone} style={{ animationDelay: `${delay}s` }}>
      <div className="highlight-card__icon">{icon}</div>
      <div className="highlight-card__label">{label}</div>
      <div className="highlight-card__title">#{story.round}, {story.title || tre.titleLost}</div>
      <div className="highlight-card__meta">
        {tre.consensusLabel} <strong>{consensusText(dict, story.consensus as ConsensusLevel | null)}</strong>
        {story.final_mean !== null && story.final_mean !== undefined && <> · {tre.meanShort} <strong>{formatMean(story.final_mean)}</strong></>}
      </div>
    </div>
  )
}

function ResumeSessionButton({ roomId, label }: { roomId: string; label: string }) {
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
      {busy ? '…' : label}
    </button>
  )
}
