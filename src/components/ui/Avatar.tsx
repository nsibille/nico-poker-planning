import type { Role } from '@/types'
import { getInitials } from '@/lib/game/utils'

type Size = 'sm' | 'lg'

interface AvatarProps {
  name: string
  role: Role
  emoji?: string | null
  size?: Size
}

export function Avatar({ name, role, emoji, size = 'sm' }: AvatarProps) {
  const baseCls = role === 'scrum-master' ? 'avatar-sm' : 'avatar-dev'
  const sizeCls = size === 'lg' ? ' avatar-lg' : ''
  return (
    <div className={`${baseCls}${sizeCls}`} title={name}>
      {emoji ? <span className="avatar-emoji" aria-hidden>{emoji}</span> : getInitials(name)}
    </div>
  )
}
