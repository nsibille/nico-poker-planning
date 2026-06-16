'use client'
import { useI18n } from '@/lib/i18n/I18nProvider'
import type { Role } from '@/types'

interface RoleSelectorProps {
  value: Role | null
  onChange: (role: Role) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const { dict } = useI18n()
  const tf = dict.app.form
  const ROLES: Array<{ id: Role; icon: string; title: string; sub: string }> = [
    { id: 'developer',    icon: '🧑‍💻', title: tf.roleDev, sub: tf.roleDevSub },
    { id: 'scrum-master', icon: '🎯',   title: tf.roleSm, sub: tf.roleSmSub },
  ]

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
        {tf.role}
      </label>
      <div className="role-card-group" role="radiogroup" aria-label={tf.role}>
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
