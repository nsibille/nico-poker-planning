'use client'
import type { Role } from '@/types'

interface RoleSelectorProps {
  value: Role | null
  onChange: (role: Role) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
        Rôle
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange('developer')}
          className="btn-secondary-md flex-1 flex items-center justify-center gap-2"
          style={value === 'developer' ? {
            background: 'var(--color-role-dev-light)',
            borderColor: 'var(--color-role-dev)',
            color: 'var(--color-role-dev-dark)',
          } : undefined}
        >
          <span>🧑‍💻</span> Développeur
        </button>
        <button
          type="button"
          onClick={() => onChange('scrum-master')}
          className="btn-secondary-md flex-1 flex items-center justify-center gap-2"
          style={value === 'scrum-master' ? {
            background: 'var(--color-brand-primary-50)',
            borderColor: 'var(--color-brand-primary)',
            color: 'var(--color-brand-primary)',
          } : undefined}
        >
          <span>🎯</span> Scrum Master
        </button>
      </div>
    </div>
  )
}
