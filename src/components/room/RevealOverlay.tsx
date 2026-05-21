'use client'
import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Phase } from '@/types'

type Preset = (fire: typeof confetti) => void

const COLORS = ['#4970ff', '#ffb24d', '#ff5e7e', '#42d392', '#a266ff', '#ffd84d', '#ff7e3a', '#3ad1ff']

function fireworks(fire: typeof confetti) {
  const end = Date.now() + 1100
  const colors = COLORS
  let tick = 0
  ;(function frame() {
    tick++
    if (tick % 2 === 0) {
      fire({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors, startVelocity: 48 })
      fire({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors, startVelocity: 48 })
    }
    if (Math.random() < 0.12) {
      fire({
        particleCount: 30,
        startVelocity: 25,
        spread: 360,
        ticks: 50,
        origin: { x: Math.random() * 0.7 + 0.15, y: Math.random() * 0.35 + 0.2 },
        colors,
        shapes: ['circle', 'square'],
        scalar: 1,
      })
    }
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function bigBang(fire: typeof confetti) {
  const defaults = { origin: { x: 0.5, y: 0.55 }, colors: COLORS }
  fire({ ...defaults, particleCount: 90, spread: 90, startVelocity: 48, scalar: 1 })
  setTimeout(() => fire({ ...defaults, particleCount: 50, spread: 130, startVelocity: 35, scalar: 0.85 }), 220)
  setTimeout(() => fire({ ...defaults, particleCount: 30, spread: 200, startVelocity: 20, scalar: 0.75, ticks: 150 }), 480)
}

function sideCannons(fire: typeof confetti) {
  const end = Date.now() + 800
  let tick = 0
  ;(function frame() {
    tick++
    if (tick % 2 === 0) {
      fire({ particleCount: 5, angle: 60, spread: 50, origin: { x: 0, y: 0.7 }, colors: COLORS, startVelocity: 55 })
      fire({ particleCount: 5, angle: 120, spread: 50, origin: { x: 1, y: 0.7 }, colors: COLORS, startVelocity: 55 })
    }
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function starShower(fire: typeof confetti) {
  const defaults = { spread: 300, ticks: 100, gravity: 0.5, decay: 0.93, startVelocity: 25, shapes: ['star'] as confetti.Shape[], colors: ['#ffd84d', '#ffb24d', '#fff8c4', '#ffe680', '#ffffff'] }
  function shoot() {
    fire({ ...defaults, particleCount: 22, scalar: 1.1, origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.3 + 0.1 } })
    fire({ ...defaults, particleCount: 8, scalar: 1.6, origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.3 + 0.1 } })
  }
  shoot()
  setTimeout(shoot, 350)
}

function schoolPride(fire: typeof confetti) {
  const end = Date.now() + 1000
  const colors = ['#4970ff', '#ffb24d']
  let tick = 0
  ;(function frame() {
    tick++
    if (tick % 2 === 0) {
      fire({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.85 }, colors, startVelocity: 45 })
      fire({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.85 }, colors, startVelocity: 45 })
    }
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function goldenRain(fire: typeof confetti) {
  const end = Date.now() + 1000
  const colors = ['#ffd84d', '#ffb24d', '#fff1a8', '#ff9d2e']
  let tick = 0
  ;(function frame() {
    tick++
    if (tick % 3 === 0) {
      fire({
        particleCount: 3,
        angle: 270,
        spread: 110,
        startVelocity: 22,
        gravity: 1.1,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        shapes: ['circle'],
        scalar: 0.95,
        ticks: 160,
      })
    }
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

const PRESETS: Preset[] = [fireworks, bigBang, sideCannons, starShower, schoolPride, goldenRain]

interface RevealOverlayProps {
  phase: Phase
}

export function RevealOverlay({ phase }: RevealOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireRef = useRef<ReturnType<typeof confetti.create> | null>(null)
  const prevPhaseRef = useRef<Phase>(phase)

  useEffect(() => {
    if (!canvasRef.current) return
    fireRef.current = confetti.create(canvasRef.current, { resize: true, useWorker: true })
    return () => {
      fireRef.current?.reset()
      fireRef.current = null
    }
  }, [])

  useEffect(() => {
    const prev = prevPhaseRef.current
    prevPhaseRef.current = phase
    if (phase !== 'revealed' || prev === 'revealed') return
    const fire = fireRef.current
    if (!fire) return
    const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)]
    preset(fire as unknown as typeof confetti)
  }, [phase])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
