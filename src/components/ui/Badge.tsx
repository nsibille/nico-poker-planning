import { ReactNode } from 'react'
import type { Phase, Role } from '@/types'

export function BadgeRole({ role }: { role: Role }) {
  if (role === 'scrum-master') {
    return <span className="badge-role-sm">SM</span>
  }
  return <span className="badge-role-dev">Dev</span>
}

export function BadgePhase({ phase, labels }: { phase: Phase; labels: Record<Phase, string> }) {
  const cls: Record<Phase, string> = {
    waiting: 'badge-phase-waiting',
    voting: 'badge-phase-voting',
    revealed: 'badge-phase-revealed',
  }
  return <span className={cls[phase]}>{labels[phase]}</span>
}

export function BadgeRound({ label }: { label: string }) {
  return <span className="badge-round">{label}</span>
}

export function BadgeRoomId({ id }: { id: string }) {
  return <span className="badge-room-id">{id}</span>
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>
}
