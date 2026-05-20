import type { Role } from '@/types'
import { getInitials } from '@/lib/game/utils'

interface AvatarProps {
  name: string
  role: Role
}

export function Avatar({ name, role }: AvatarProps) {
  const cls = role === 'scrum-master' ? 'avatar-sm' : 'avatar-dev'
  return <div className={cls}>{getInitials(name)}</div>
}
