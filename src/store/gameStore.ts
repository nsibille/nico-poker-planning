'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'

export interface RoomSession {
  playerId: string
  name: string
  role: Role
  emoji: string | null
}

interface GameState {
  // Sessions actives indexées par roomId. Une même personne (même device) peut
  // participer à plusieurs rooms en parallèle, chacune avec son propre player.
  // L'URL de la room fait foi : c'est elle qui détermine quelle session lire,
  // jamais l'inverse.
  sessions: Record<string, RoomSession>
  // Dernière room rejointe. Sert uniquement à proposer une reprise quand on
  // arrive sur /app sans cible explicite. Ne doit jamais overrider une URL.
  lastRoomId: string | null
  selectedVote: string | null
  joinRoom: (roomId: string, session: RoomSession) => void
  leaveRoom: (roomId: string) => void
  setSelectedVote: (value: string | null) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      sessions: {},
      lastRoomId: null,
      selectedVote: null,
      joinRoom: (roomId, session) =>
        set((state) => ({
          sessions: { ...state.sessions, [roomId]: session },
          lastRoomId: roomId,
        })),
      leaveRoom: (roomId) =>
        set((state) => {
          const next = { ...state.sessions }
          delete next[roomId]
          return {
            sessions: next,
            lastRoomId: state.lastRoomId === roomId ? null : state.lastRoomId,
          }
        }),
      setSelectedVote: (value) => set({ selectedVote: value }),
    }),
    {
      name: 'poker-game-store',
      version: 1,
      partialize: (state) => ({ sessions: state.sessions, lastRoomId: state.lastRoomId }),
      migrate: (persisted, version) => {
        // v0 ne stockait qu'une seule session globale (myRoomId / myPlayerId
        // / myRole / ...). On la convertit en une entrée du nouveau
        // dictionnaire sessions pour ne pas déconnecter les sessions en cours.
        if (version === 0 && persisted && typeof persisted === 'object') {
          const old = persisted as {
            myRoomId?: string | null
            myPlayerId?: string | null
            myName?: string
            myRole?: Role | null
            myEmoji?: string | null
          }
          if (old.myRoomId && old.myPlayerId && old.myRole) {
            return {
              sessions: {
                [old.myRoomId]: {
                  playerId: old.myPlayerId,
                  name: old.myName ?? '',
                  role: old.myRole,
                  emoji: old.myEmoji ?? null,
                },
              },
              lastRoomId: old.myRoomId,
            } as GameState
          }
          return { sessions: {}, lastRoomId: null } as GameState
        }
        return persisted as GameState
      },
    },
  ),
)

// Sélecteur dédié : renvoie la session de la room demandée, ou null. C'est le
// point d'entrée unique pour savoir "qui suis-je dans CETTE room".
export function useRoomSession(roomId: string | null | undefined): RoomSession | null {
  return useGameStore((state) => (roomId ? state.sessions[roomId] ?? null : null))
}
