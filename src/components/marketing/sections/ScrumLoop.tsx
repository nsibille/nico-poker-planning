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
  [5, 8, 5, 8, 13],   // discuss
  [8, 13, 21, 40, 13], // divergent
  [1, 1, 1, 1, 1],    // perfect
  [2, 3, 2, 3, 2],    // aligned
  [1, 1, 1, 1, 1],    // perfect
  [3, 8, 13, 5, 8],   // divergent
  [1, 2, 1, 2, 3],    // discuss
  [2, 3, 3, 2, 3],    // aligned
  [13, 21, 40, 8, 100], // divergent
  [8, 13, 8, 13, 8],  // aligned
  [2, 2, 3, 2, 2],    // aligned
  [1, 1, 2, 1, 1],    // aligned
  [8, 13, 21, 13, 8], // discuss
  [3, 5, 8, 13, 5],   // divergent
  [3, 3, 3, 3, 3],    // perfect
  [3, 5, 5, 3, 5],    // aligned
  [5, 8, 13, 8, 5],   // discuss
  [2, 3, 8, 2, 13],   // divergent
  [8, 8, 8, 8, 8],    // perfect
  [1, 2, 2, 1, 2],    // aligned
  [13, 21, 13, 21, 13], // aligned
  [1, 1, 1, 2, 1],    // aligned
  [3, 5, 8, 5, 5],    // discuss
  [2, 3, 3, 3, 2],    // aligned
  [5, 8, 5, 13, 8],   // discuss
  [5, 5, 5, 5, 5],    // perfect
  [8, 21, 3, 13, 5],  // divergent
  [8, 13, 8, 8, 13],  // aligned
  [13, 8, 21, 13, 8], // discuss
  [2, 2, 2, 2, 2],    // perfect
]

const FIB = [0, 1, 2, 3, 5, 8, 13, 21, 40, 100]
const fibIdx = (v: number) => FIB.indexOf(v)

function levelOf(votes: number[]): Level {
  const ix = votes.map(fibIdx)
  const spread = Math.max(...ix) - Math.min(...ix)
  if (spread === 0) return 'perfect'
  if (spread <= 1) return 'aligned'
  if (spread <= 2) return 'discuss'
  return 'divergent'
}
function modeOf(votes: number[]): number {
  const counts = new Map<number, number>()
  votes.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1))
  let best = votes[0]
  let bestCount = 0
  for (const [v, c] of counts) {
    if (c > bestCount || (c === bestCount && fibIdx(v) > fibIdx(best))) {
      best = v
      bestCount = c
    }
  }
  return best
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
  const mode = modeOf(votes)
  const modeIndex = fibIdx(mode)

  const storyReady = phase !== 'onboard'
  const isResults = phase === 'reveal' || phase === 'debate' || phase === 'consensus'
  const settled = phase === 'consensus'
  const converged = settled && needsDebate
  const values = converged ? PLAYERS.map(() => mode) : votes
  const celebrate = settled || (phase === 'reveal' && level === 'perfect')
  const showBanner = phase === 'debate' && needsDebate
  const displayLevel: Level = converged ? 'perfect' : level

  const caption =
    phase === 'debate' || phase === 'consensus'
      ? needsDebate
        ? scene.caption
        : dict.validated
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
            <h3 className={storyReady ? '' : 'is-pending'}>
              {storyReady ? dict.stories[storyIdx] : '…'}
            </h3>
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
                    const isOutlier = !settled && Math.abs(fibIdx(value) - modeIndex) > 1
                    const tier = settled ? 'cool' : isOutlier ? 'hot' : 'mid'
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
                    <strong className={displayLevel === 'perfect' || displayLevel === 'aligned' ? 'scrum-loop__consensus-ok' : ''}>
                      {dict.consensus[displayLevel]}
                    </strong>
                  </div>
                  <div>
                    <span className="eyebrow eyebrow--mini">{dict.stats.mode}</span>
                    <strong className="scrum-loop__tier">{mode}</strong>
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
