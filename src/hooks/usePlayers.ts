'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Player } from '@/types'

export function usePlayers(roomId: string) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return
    const supabase = createClient()
    let cancelled = false

    async function refetch() {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at')
      if (cancelled) return
      setPlayers((data ?? []) as Player[])
      setLoading(false)
    }

    const channel = supabase
      .channel(`players-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const np = payload.new as Player
            setPlayers(prev => prev.some(p => p.id === np.id) ? prev : [...prev, np])
          } else if (payload.eventType === 'DELETE') {
            setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setPlayers(prev => prev.map(p => p.id === (payload.new as Player).id ? payload.new as Player : p))
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') void refetch()
      })

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { players, loading }
}
