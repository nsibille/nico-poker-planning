'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'

interface GameState {
  myName: string
  myRole: Role | null
  myPlayerId: string | null
  selectedVote: string | null
  setMyName: (name: string) => void
  setMyRole: (role: Role) => void
  setMyPlayerId: (id: string) => void
  setSelectedVote: (value: string | null) => void
  reset: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      myName: '',
      myRole: null,
      myPlayerId: null,
      selectedVote: null,
      setMyName: (name) => set({ myName: name }),
      setMyRole: (role) => set({ myRole: role }),
      setMyPlayerId: (id) => set({ myPlayerId: id }),
      setSelectedVote: (value) => set({ selectedVote: value }),
      reset: () => set({ myName: '', myRole: null, myPlayerId: null, selectedVote: null }),
    }),
    { name: 'poker-game-store' }
  )
)
