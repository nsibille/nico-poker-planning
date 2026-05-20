import { ReactNode } from 'react'
import type { Phase, Role } from '@/types'

export function BadgeRole({ role }: { role: Role }) {
  if (role === 'scrum-master') {
    return <span className="badge-role-sm">SM</span>
  }
  return <span className="badge-role-dev">Dev</span>
}

export function BadgePhase({ phase }: { phase: Phase }) {
  const labels: Record<Phase, string> = {
    waiting: 'En attente',
    voting: 'Vote en cours',
    revealed: 'Révélés',
  }
  const cls: Record<Phase, string> = {
    waiting: 'badge-phase-waiting',
    voting: 'badge-phase-voting',
    revealed: 'badge-phase-revealed',
  }
  return <span className={cls[phase]}>{labels[phase]}</span>
}

export function BadgeRound({ round }: { round: number }) {
  return <span className="badge-round">Round {round}</span>
}

export function BadgeRoomId({ id }: { id: string }) {
  return <span className="badge-room-id">{id}</span>
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>
}
