'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { Dictionary } from '@/lib/i18n/dict'

type LoopDict = Dictionary['heroLoop']

const PHASES = ['onboard', 'voting', 'reveal', 'debate', 'consensus'] as const
type Phase = (typeof PHASES)[number]

const DURATIONS: Record<Phase, number> = {
  onboard: 2600,
  voting: 2600,
  reveal: 2400,
  debate: 3000,
  consensus: 2900,
}

const PLAYERS = [
  { emoji: '🦊', name: 'Lina', reveal: 5 },
  { emoji: '🐼', name: 'Tom', reveal: 8 },
  { emoji: '🦉', name: 'Sam', reveal: 5 },
  { emoji: '🐰', name: 'Pol', reveal: 8 },
  { emoji: '🐙', name: 'Jin', reveal: 13 },
] as const

const CONSENSUS_VALUE = 8
const OUTLIER_INDEX = 4

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

function barPct(value: number) {
  return Math.max(22, Math.min(100, (value / 13) * 100))
}

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
  const [{ index, cycle }, setState] = useState({ index: 0, cycle: 0 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => {
      setState((s) => {
        const next = (s.index + 1) % PHASES.length
        return { index: next, cycle: next === 0 ? s.cycle + 1 : s.cycle }
      })
    }, DURATIONS[PHASES[index]])
    return () => clearTimeout(t)
  }, [index, cycle, reduced])

  // Under reduced motion, freeze on the reveal scoreboard.
  const phase: Phase = reduced ? 'reveal' : PHASES[index]
  const scene = dict.scenes[phase]
  const storyReady = phase !== 'onboard'
  const isResults = phase === 'reveal' || phase === 'debate' || phase === 'consensus'
  const converged = phase === 'consensus'
  const celebrate = phase === 'reveal' || phase === 'consensus'

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
            <h3 className={storyReady ? '' : 'is-pending'}>{storyReady ? dict.story : '…'}</h3>
          </div>

          <div className="scrum-loop__stage">
            {phase === 'onboard' && (
              <div className="scrum-loop__avatars" key={`onboard-${cycle}`}>
                {PLAYERS.map((p, i) => (
                  <div
                    className="scrum-loop__avatar"
                    key={p.name}
                    style={{ animationDelay: `${i * 0.34}s` }}
                  >
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
                  <div
                    className="scrum-loop__card"
                    key={p.name}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    <span className="scrum-loop__card-q">?</span>
                    <span
                      className="scrum-loop__card-check"
                      style={{ animationDelay: `${0.6 + i * 0.34}s` }}
                    >
                      ✓
                    </span>
                    <span className="scrum-loop__card-name">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {isResults && (
              <div className="scrum-loop__results" key={`results-${cycle}`}>
                <div className={`scrum-loop__banner${phase === 'debate' ? ' is-visible' : ''}`}>
                  <span className="scrum-loop__banner-icon">💬</span>
                  <div className="scrum-loop__banner-text">
                    <strong>{dict.discussTitle}</strong>
                    <p>{dict.discussBody}</p>
                  </div>
                </div>

                <div className="scrum-loop__chart">
                  {PLAYERS.map((p, i) => {
                    const value = converged ? CONSENSUS_VALUE : p.reveal
                    const tier = converged ? 'cool' : value >= 13 ? 'hot' : 'mid'
                    const isOutlier = !converged && i === OUTLIER_INDEX
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
                    <span className="eyebrow eyebrow--mini">{dict.stats.median}</span>
                    <strong>8</strong>
                  </div>
                  <div>
                    <span className="eyebrow eyebrow--mini">{dict.stats.consensus}</span>
                    <strong className={converged ? 'scrum-loop__consensus-ok' : ''}>
                      {converged ? '100%' : '60%'}
                    </strong>
                  </div>
                  <div>
                    <span className="eyebrow eyebrow--mini">{dict.stats.tier}</span>
                    <strong className="scrum-loop__tier">{dict.tier}</strong>
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
              {scene.caption}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
