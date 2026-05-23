'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { Dictionary } from '@/lib/i18n/dict'

type LoopDict = Dictionary['heroLoop']
type Level = 'perfect' | 'aligned' | 'discuss' | 'divergent'

const PHASES = ['onboard', 'voting', 'reveal', 'debate', 'consensus'] as const
type Phase = (typeof PHASES)[number]

const DURATIONS: Record<Phase, number> = {
  onboard: 2400,
  voting: 2400,
  reveal: 2400,
  debate: 3000,
  consensus: 2800,
}

const PLAYERS = [
  { emoji: '🦊', name: 'Lina' },
  { emoji: '🐼', name: 'Tom' },
  { emoji: '🦉', name: 'Sam' },
  { emoji: '🐰', name: 'Pol' },
  { emoji: '🐙', name: 'Jin' },
] as const

// Vote sets aligned by index with heroLoop.stories. Each row = the 5 dev votes
// (Fibonacci). Consensus level is derived from the spread, same rule as the app
// (lib/game/reveal-stats.ts): perfect = identical, aligned ≤ 1 step, discuss ≤ 2,
// divergent beyond. discuss/divergent trigger debate + reopen → convergence.
const STORY_VOTES: number[][] = [
  [3, 8, 21, 5, 13],   // divergent (story 0 = premiere vue, gros ecart)
  [5, 13, 40, 8, 21],  // divergent
  [1, 1, 1, 1, 1],     // perfect
  [2, 3, 2, 3, 2],     // aligned
  [2, 2, 2, 2, 2],     // perfect
  [2, 8, 21, 5, 13],   // divergent
  [1, 2, 1, 2, 3],     // discuss
  [3, 5, 5, 3, 5],     // aligned
  [13, 40, 100, 8, 21], // divergent
  [8, 13, 8, 13, 8],   // aligned
  [2, 2, 3, 2, 2],     // aligned
  [1, 1, 1, 1, 1],     // perfect
  [8, 13, 21, 13, 8],  // discuss
  [2, 5, 13, 21, 8],   // divergent
  [3, 5, 3, 5, 3],     // aligned
  [5, 8, 5, 5, 8],     // aligned
  [5, 8, 13, 8, 5],    // discuss
  [1, 3, 13, 2, 21],   // divergent
  [3, 5, 8, 3, 5],     // discuss
  [2, 2, 2, 2, 2],     // perfect
  [8, 13, 8, 21, 13],  // discuss
  [1, 1, 1, 1, 1],     // perfect
  [3, 5, 8, 5, 5],     // discuss
  [2, 3, 3, 3, 2],     // aligned
  [5, 8, 5, 13, 8],    // discuss
  [5, 5, 5, 5, 5],     // perfect
  [2, 8, 21, 40, 5],   // divergent
  [8, 5, 13, 8, 8],    // discuss
  [5, 13, 40, 8, 21],  // divergent
  [3, 3, 3, 3, 3],     // perfect
]

const FIB = [0, 1, 2, 3, 5, 8, 13, 21, 40, 100]
const fibIdx = (v: number) => FIB.indexOf(v)

// Post-revote outcome per debate story, aligned by index with STORY_VOTES.
// null = no debate (perfect/aligned reveal). For debate stories the extremes
// come back toward the median: roughly one in three reaches full consensus,
// the rest just shrink the gap (still discuss/aligned).
const STORY_SETTLE: (number[] | null)[] = [
  [5, 8, 13, 5, 13],   // 0  divergent → discuss
  [8, 13, 13, 8, 13],  // 1  divergent → aligned
  null,                // 2
  null,                // 3
  null,                // 4
  [5, 8, 13, 5, 13],   // 5  divergent → discuss
  [2, 2, 2, 2, 2],     // 6  discuss → perfect
  null,                // 7
  [13, 21, 21, 13, 21], // 8 divergent → aligned
  null,                // 9
  null,                // 10
  null,                // 11
  [13, 13, 13, 13, 13], // 12 discuss → perfect
  [5, 5, 13, 13, 8],   // 13 divergent → discuss
  null,                // 14
  null,                // 15
  [8, 8, 8, 8, 8],     // 16 discuss → perfect
  [1, 3, 3, 2, 3],     // 17 divergent → discuss
  [3, 5, 5, 3, 5],     // 18 discuss → aligned
  null,                // 19
  [8, 13, 8, 13, 13],  // 20 discuss → aligned
  null,                // 21
  [5, 5, 5, 5, 5],     // 22 discuss → perfect
  null,                // 23
  [5, 8, 5, 8, 8],     // 24 discuss → aligned
  null,                // 25
  [5, 8, 13, 13, 5],   // 26 divergent → discuss
  [8, 8, 8, 8, 8],     // 27 discuss → perfect
  [13, 13, 13, 13, 13], // 28 divergent → perfect
  null,                // 29
]

function levelOf(votes: number[]): Level {
  const ix = votes.map(fibIdx)
  const spread = Math.max(...ix) - Math.min(...ix)
  if (spread === 0) return 'perfect'
  if (spread <= 1) return 'aligned'
  if (spread <= 2) return 'discuss'
  return 'divergent'
}
function medianValue(votes: number[]): number {
  const sorted = votes.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
function meanOf(votes: number[]): string {
  const m = votes.reduce((a, b) => a + b, 0) / votes.length
  return Number.isInteger(m) ? String(m) : m.toFixed(1)
}
function barPct(v: number): number {
  return Math.max(20, Math.min(100, 20 + (fibIdx(v) / 7) * 80))
}
function shuffle(arr: number[]): number[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Deterministic confetti pieces (no Math.random, avoids hydration drift).
const CONFETTI = [
  { left: 6, delay: 0, color: 'var(--color-brand-primary)', rot: -24 },
  { left: 14, delay: 0.18, color: 'var(--color-amber)', rot: 40 },
  { left: 23, delay: 0.06, color: 'var(--color-coral)', rot: 12 },
  { left: 32, delay: 0.3, color: 'var(--color-teal-600)', rot: -60 },
  { left: 41, delay: 0.12, color: 'var(--color-violet)', rot: 30 },
  { left: 50, delay: 0.24, color: 'var(--color-sky)', rot: -16 },
  { left: 59, delay: 0.04, color: 'var(--color-brand-primary)', rot: 52 },
  { left: 68, delay: 0.28, color: 'var(--color-amber)', rot: -40 },
  { left: 77, delay: 0.1, color: 'var(--color-coral)', rot: 20 },
  { left: 86, delay: 0.22, color: 'var(--color-teal-600)', rot: -52 },
  { left: 94, delay: 0.08, color: 'var(--color-violet)', rot: 36 },
  { left: 38, delay: 0.34, color: 'var(--color-sky)', rot: -28 },
] as const

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )
}

// Typewriter effect for the story title. Remounted per story via `key`, so the
// initial count comes from the state initializer (no synchronous setState in an
// effect). The interval only ever schedules functional updates.
function TypedStory({ text }: { text: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setN((p) => Math.min(p + 1, text.length)), 42)
    return () => clearInterval(id)
  }, [text])
  const done = n >= text.length
  return (
    <h3>
      {text.slice(0, n)}
      <span className={`scrum-loop__caret${done ? ' is-done' : ''}`} />
    </h3>
  )
}

type Props = { dict: LoopDict }

export function ScrumLoop({ dict }: Props) {
  const [state, setState] = useState({ index: 0, cycle: 0, storyIdx: 0, queue: [] as number[] })
  const reduced = useReducedMotion()
  const { index, cycle, storyIdx } = state

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => {
      setState((s) => {
        const next = (s.index + 1) % PHASES.length
        if (next !== 0) return { ...s, index: next }
        let queue = s.queue
        if (queue.length === 0) {
          queue = shuffle(STORY_VOTES.map((_, i) => i).filter((i) => i !== s.storyIdx))
        }
        const [nextStory, ...rest] = queue
        return { index: 0, cycle: s.cycle + 1, storyIdx: nextStory, queue: rest }
      })
    }, DURATIONS[PHASES[index]])
    return () => clearTimeout(t)
  }, [index, cycle, reduced])

  const phase: Phase = reduced ? 'reveal' : PHASES[index]
  const scene = dict.scenes[phase]
  const votes = STORY_VOTES[storyIdx]
  const level = levelOf(votes)
  const needsDebate = level === 'discuss' || level === 'divergent'
  const medianIndex = fibIdx(medianValue(votes))
  // Post-revote votes: extremes drift back toward the median, not always to a
  // flat consensus (see STORY_SETTLE).
  const settleVotes = (needsDebate && STORY_SETTLE[storyIdx]) || votes

  const storyReady = phase !== 'onboard'
  const isResults = phase === 'reveal' || phase === 'debate' || phase === 'consensus'
  const settled = phase === 'consensus'
  const values = settled ? settleVotes : votes
  const displayLevel: Level = settled ? levelOf(settleVotes) : level
  const resolved = displayLevel === 'perfect' || displayLevel === 'aligned'
  const celebrate = (settled && resolved) || (phase === 'reveal' && level === 'perfect')
  const showBanner = phase === 'debate' && needsDebate

  const caption =
    phase === 'debate' || phase === 'consensus'
      ? !needsDebate
        ? dict.validated
        : phase === 'consensus'
          ? displayLevel === 'perfect'
            ? scene.caption
            : dict.reduced
          : scene.caption
      : scene.caption

  return (
    <div className="marketing-hero__preview" aria-hidden>
      <div className="scrum-loop">
        <div className="scrum-loop__frame" data-phase={phase}>
          {celebrate && (
            <div className="scrum-loop__confetti" key={`fx-${cycle}-${phase}`}>
              {CONFETTI.map((c, i) => (
                <span
                  key={i}
                  className="scrum-loop__confetti-piece"
                  style={{
                    left: `${c.left}%`,
                    background: c.color,
                    animationDelay: `${c.delay}s`,
                    ['--rot' as string]: `${c.rot}deg`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="scrum-loop__top">
            <span className="scrum-loop__chip">
              <span style={{ fontSize: 13 }}>🃏</span>
              <span>
                {dict.room}
                <code className="mono-coral">{dict.code}</code>
              </span>
            </span>
            <span className="scrum-loop__role">🎯 {dict.role}</span>
          </div>

          <div className="scrum-loop__story">
            <span className="eyebrow eyebrow--mini">Story</span>
            {storyReady ? (
              reduced ? (
                <h3>{dict.stories[storyIdx]}</h3>
              ) : (
                <TypedStory key={cycle} text={dict.stories[storyIdx]} />
              )
            ) : (
              <h3 className="is-pending">…</h3>
            )}
          </div>

          <div className="scrum-loop__stage">
            {phase === 'onboard' && (
              <div className="scrum-loop__avatars" key={`onboard-${cycle}`}>
                {PLAYERS.map((p, i) => (
                  <div className="scrum-loop__avatar" key={p.name} style={{ animationDelay: `${i * 0.34}s` }}>
                    <span className="scrum-loop__avatar-face">{p.emoji}</span>
                    <span className="scrum-loop__avatar-name">{p.name}</span>
                    <span className="scrum-loop__avatar-tag">{dict.joined}</span>
                  </div>
                ))}
              </div>
            )}

            {phase === 'voting' && (
              <div className="scrum-loop__cards" key={`voting-${cycle}`}>
                {PLAYERS.map((p, i) => (
                  <div className="scrum-loop__card" key={p.name} style={{ animationDelay: `${i * 0.12}s` }}>
                    <span className="scrum-loop__card-q">?</span>
                    <span className="scrum-loop__card-check" style={{ animationDelay: `${0.6 + i * 0.34}s` }}>
                      ✓
                    </span>
                    <span className="scrum-loop__card-name">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {isResults && (
              <div className="scrum-loop__results" key={`results-${cycle}`}>
                <div className={`scrum-loop__banner${showBanner ? ' is-visible' : ''}`}>
                  <span className="scrum-loop__banner-icon">💬</span>
                  <div className="scrum-loop__banner-text">
                    <strong>{dict.discussTitle}</strong>
                    <p>{dict.discussBody}</p>
                  </div>
                </div>

                <div className="scrum-loop__chart">
                  {PLAYERS.map((p, i) => {
                    const value = values[i]
                    const isOutlier = !settled && Math.abs(fibIdx(value) - medianIndex) > 1
                    const tier = settled ? (resolved ? 'cool' : 'mid') : isOutlier ? 'hot' : 'mid'
                    return (
                      <div className="scrum-loop__bar" key={p.name}>
                        <span className="scrum-loop__bar-token">
                          <span className="scrum-loop__bar-emoji">{p.emoji}</span>
                          <span className="scrum-loop__bar-value" data-tier={tier}>
                            {value}
                          </span>
                        </span>
                        <div className="scrum-loop__bar-track">
                          <div
                            className={`scrum-loop__bar-fill scrum-loop__bar-fill--${tier}${isOutlier ? ' is-outlier' : ''}`}
                            style={{ height: `${barPct(value)}%` }}
                          >
                            {isOutlier && <span className="scrum-loop__bar-flag">⚠️</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="scrum-loop__stats">
                  <div>
                    <span className="eyebrow eyebrow--mini">{dict.stats.mean}</span>
                    <strong>{meanOf(values)}</strong>
                  </div>
                  <div>
                    <span className="eyebrow eyebrow--mini">{dict.stats.consensus}</span>
                    <strong className={resolved ? 'scrum-loop__consensus-ok' : ''}>
                      {dict.consensus[displayLevel]}
                    </strong>
                  </div>
                  <div>
                    <span className="eyebrow eyebrow--mini">{dict.stats.median}</span>
                    <strong className="scrum-loop__tier">{medianValue(values)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="scrum-loop__footer">
            <span className="scrum-loop__phase" data-phase={phase}>
              {scene.label}
            </span>
            <span className="scrum-loop__caption" key={`cap-${cycle}-${phase}`}>
              {caption}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
