'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'

interface GameState {
  myName: string
  myRole: Role | null
  myPlayerId: string | null
  myRoomId: string | null
  myEmoji: string | null
  selectedVote: string | null
  setMyName: (name: string) => void
  setMyRole: (role: Role) => void
  setMyPlayerId: (id: string) => void
  setMyRoomId: (id: string | null) => void
  setMyEmoji: (emoji: string | null) => void
  setSelectedVote: (value: string | null) => void
  reset: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      myName: '',
      myRole: null,
      myPlayerId: null,
      myRoomId: null,
      myEmoji: null,
      selectedVote: null,
      setMyName: (name) => set({ myName: name }),
      setMyRole: (role) => set({ myRole: role }),
      setMyPlayerId: (id) => set({ myPlayerId: id }),
      setMyRoomId: (id) => set({ myRoomId: id }),
      setMyEmoji: (emoji) => set({ myEmoji: emoji }),
      setSelectedVote: (value) => set({ selectedVote: value }),
      reset: () => set({ myName: '', myRole: null, myPlayerId: null, myRoomId: null, myEmoji: null, selectedVote: null }),
    }),
    { name: 'poker-game-store' }
  )
)
