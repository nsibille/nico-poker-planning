'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Vote } from '@/types'

export function useVotes(roomId: string, round: number) {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return
    const supabase = createClient()
    let cancelled = false

    async function refetch() {
      const { data } = await supabase
        .from('votes')
        .select('*')
        .eq('room_id', roomId)
        .eq('round', round)
      if (cancelled) return
      setVotes((data ?? []) as Vote[])
      setLoading(false)
    }

    const channel = supabase
      .channel(`votes-${roomId}-${round}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const v = payload.new as Vote
            if (v.round === round) setVotes(prev => prev.some(x => x.id === v.id) ? prev : [...prev, v])
          } else if (payload.eventType === 'UPDATE') {
            const v = payload.new as Vote
            if (v.round === round) setVotes(prev => prev.map(x => x.id === v.id ? v : x))
          } else if (payload.eventType === 'DELETE') {
            setVotes(prev => prev.filter(x => x.id !== payload.old.id))
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
  }, [roomId, round])

  return { votes, loading }
}
