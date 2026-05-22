export type Phase = 'waiting' | 'voting' | 'revealed'
export type Role = 'developer' | 'scrum-master'

export interface Room {
  id: string
  phase: Phase
  story: string
  round: number
  scale_id: string
  scale_values: (number | string)[] | null
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  room_id: string
  name: string
  role: Role
  user_id: string | null
  emoji: string | null
  joined_at: string
}

export interface Vote {
  id: string
  room_id: string
  player_id: string
  round: number
  value: string
  created_at: string
}
