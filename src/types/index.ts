export type Phase = 'waiting' | 'voting' | 'revealed'
export type Role = 'developer' | 'scrum-master'

export interface Room {
  id: string
  phase: Phase
  story: string
  round: number
  scale_id: string
  scale_values: (number | string)[] | null
  ended_at: string | null
  /** Posé quand le SM lance le vote. Base du chrono de round (temps écoulé
   *  calculé côté client). Null hors phase de vote. */
  timer_started_at: string | null
  created_at: string
  updated_at: string
}

export type ConsensusLevel = 'perfect' | 'aligned' | 'discuss' | 'divergent' | 'empty'

export interface Story {
  room_id: string
  round: number
  title: string
  final_mean: number | null
  consensus: ConsensusLevel | null
  /** Durée du vote (secondes) figée au reveal. Null si non mesurée (round
   *  révélé avant l'ajout du chrono, ou backfill). */
  voting_seconds: number | null
  revealed_at: string
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
  /** Optional, present once migration 20260521020000 is applied. Used to
   *  compute response times in the session recap (= last vote change). */
  updated_at?: string
}
