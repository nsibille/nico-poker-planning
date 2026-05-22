'use client'
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'sprint-poker-user-id'

// Cache module-level : le snapshot doit être référentiellement stable entre
// les appels (useSyncExternalStore l'appelle plusieurs fois par render).
let cachedId: string | null = null

function getOrCreateUserId(): string {
  if (cachedId) return cachedId
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  cachedId = id
  return id
}

// L'userId est purement local (localStorage) et ne change jamais après le
// premier lookup côté client, pas de subscribe nécessaire.
const noopSubscribe = () => () => {}

export function useSession() {
  const userId = useSyncExternalStore<string | null>(
    noopSubscribe,
    () => getOrCreateUserId(),
    () => null,
  )
  return { userId, loading: userId === null }
}
