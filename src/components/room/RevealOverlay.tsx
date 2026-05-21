'use client'
import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Phase } from '@/types'

type Preset = (fire: typeof confetti) => void

const COLORS = ['#4970ff', '#ffb24d', '#ff5e7e', '#42d392', '#a266ff', '#ffd84d', '#ff7e3a', '#3ad1ff']

function fireworks(fire: typeof confetti) {
  const duration = 2200
  const end = Date.now() + duration
  const colors = COLORS
  ;(function frame() {
    fire({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors, startVelocity: 55 })
    fire({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors, startVelocity: 55 })
    if (Math.random() < 0.6) {
      fire({
        particleCount: 80,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.4 + 0.2 },
        colors,
        shapes: ['circle', 'square'],
        scalar: 1.1,
      })
    }
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function bigBang(fire: typeof confetti) {
  const defaults = { origin: { x: 0.5, y: 0.55 }, colors: COLORS }
  fire({ ...defaults, particleCount: 200, spread: 100, startVelocity: 55, scalar: 1.2 })
  setTimeout(() => fire({ ...defaults, particleCount: 120, spread: 120, startVelocity: 45, scalar: 0.9 }), 180)
  setTimeout(() => fire({ ...defaults, particleCount: 80, spread: 160, startVelocity: 25, scalar: 0.8 }), 380)
  setTimeout(() => fire({ ...defaults, particleCount: 60, spread: 360, startVelocity: 15, scalar: 0.7, ticks: 200 }), 600)
}

function sideCannons(fire: typeof confetti) {
  const end = Date.now() + 1500
  ;(function frame() {
    fire({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: COLORS, startVelocity: 65 })
    fire({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: COLORS, startVelocity: 65 })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function starShower(fire: typeof confetti) {
  const defaults = { spread: 360, ticks: 120, gravity: 0.4, decay: 0.94, startVelocity: 30, shapes: ['star'] as confetti.Shape[], colors: ['#ffd84d', '#ffb24d', '#fff8c4', '#ffe680', '#ffffff'] }
  function shoot() {
    fire({ ...defaults, particleCount: 50, scalar: 1.3, origin: { x: Math.random(), y: Math.random() * 0.4 } })
    fire({ ...defaults, particleCount: 20, scalar: 0.8, origin: { x: Math.random(), y: Math.random() * 0.4 } })
    fire({ ...defaults, particleCount: 12, scalar: 2.2, origin: { x: Math.random(), y: Math.random() * 0.4 } })
  }
  shoot()
  setTimeout(shoot, 300)
  setTimeout(shoot, 600)
  setTimeout(shoot, 900)
}

function schoolPride(fire: typeof confetti) {
  const end = Date.now() + 2000
  const colors = ['#4970ff', '#ffb24d']
  ;(function frame() {
    fire({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors })
    fire({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function goldenRain(fire: typeof confetti) {
  const end = Date.now() + 1800
  const colors = ['#ffd84d', '#ffb24d', '#fff1a8', '#ff9d2e']
  ;(function frame() {
    fire({
      particleCount: 6,
      angle: 270,
      spread: 120,
      startVelocity: 25,
      gravity: 1.1,
      origin: { x: Math.random(), y: -0.1 },
      colors,
      shapes: ['circle'],
      scalar: 1.1,
      ticks: 200,
    })
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
