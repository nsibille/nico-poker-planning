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

    supabase
      .from('players')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at')
      .then(({ data }) => {
        setPlayers((data ?? []) as Player[])
        setLoading(false)
      })

    const channel = supabase
      .channel(`players-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers(prev => [...prev, payload.new as Player])
          } else if (payload.eventType === 'DELETE') {
            setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setPlayers(prev => prev.map(p => p.id === (payload.new as Player).id ? payload.new as Player : p))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  return { players, loading }
}
