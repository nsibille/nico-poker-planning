'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Story, ConsensusLevel } from '@/types'

function normalize(row: Record<string, unknown>): Story {
  return {
    room_id: row.room_id as string,
    round: row.round as number,
    title: (row.title as string) ?? '',
    final_mean: row.final_mean === null || row.final_mean === undefined
      ? null
      : Number(row.final_mean),
    consensus: (row.consensus as ConsensusLevel | null) ?? null,
    revealed_at: row.revealed_at as string,
    updated_at: row.updated_at as string,
  }
}

export function useStories(roomId: string) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return
    const supabase = createClient()
    let cancelled = false

    async function refetch() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .eq('room_id', roomId)
        .order('round', { ascending: true })
      if (cancelled) return
      setStories((data ?? []).map((r) => normalize(r as Record<string, unknown>)))
      setLoading(false)
    }

    const channel = supabase
      .channel(`stories-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stories', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const s = normalize(payload.new as Record<string, unknown>)
            setStories((prev) => {
              const i = prev.findIndex((x) => x.round === s.round)
              if (i === -1) return [...prev, s].sort((a, b) => a.round - b.round)
              const next = [...prev]
              next[i] = s
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            const old = payload.old as { round?: number }
            setStories((prev) => prev.filter((x) => x.round !== old.round))
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

  return { stories, loading }
}
