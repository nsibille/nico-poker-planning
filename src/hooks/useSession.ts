'use client'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sprint-poker-user-id'

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(STORAGE_KEY, id)
    }
    setUserId(id)
    setLoading(false)
  }, [])

  return { userId, loading }
}
