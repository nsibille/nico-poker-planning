'use client'
import type { Role } from '@/types'

interface RoleSelectorProps {
  value: Role | null
  onChange: (role: Role) => void
}

const ROLES: Array<{ id: Role; icon: string; title: string; sub: string }> = [
  { id: 'developer',    icon: '🧑‍💻', title: 'Développeur', sub: 'Je vote' },
  { id: 'scrum-master', icon: '🎯',   title: 'Scrum Master', sub: 'J\'anime' },
]

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
        Rôle
      </label>
      <div className="role-card-group" role="radiogroup" aria-label="Rôle">
        {ROLES.map(r => {
          const selected = value === r.id
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-role={r.id}
              onClick={() => onChange(r.id)}
              className={`role-card ${selected ? 'role-card--selected' : ''}`}
            >
              <span className="role-card__icon" aria-hidden>{r.icon}</span>
              <span className="role-card__text">
                <span className="role-card__title">{r.title}</span>
                <span className="role-card__sub">{r.sub}</span>
              </span>
              <span className="role-card__check" aria-hidden>✓</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
