'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RoomHeader } from '@/components/room/RoomHeader'
import { PlayersList } from '@/components/room/PlayersList'
import { StoryPanel } from '@/components/room/StoryPanel'
import { VoteGrid } from '@/components/room/VoteGrid'
import { StatusBar } from '@/components/room/StatusBar'
import { Toast, useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import { useRoom } from '@/hooks/useRoom'
import { usePlayers } from '@/hooks/usePlayers'
import { useVotes } from '@/hooks/useVotes'
import { useSession } from '@/hooks/useSession'
import { useGameStore } from '@/store/gameStore'
import { createClient } from '@/lib/supabase/client'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { toast, showToast, clearToast } = useToast()

  const { userId } = useSession()
  const { myPlayerId, myRole, selectedVote } = useGameStore()

  const { room, loading: roomLoading } = useRoom(roomId)
  const { players } = usePlayers(roomId)
  const { votes } = useVotes(roomId, room?.round ?? 1)

  // Redirect if room not found after loading
  useEffect(() => {
    if (!roomLoading && !room) {
      showToast('Room introuvable')
      setTimeout(() => router.push('/'), 1500)
    }
  }, [room, roomLoading, router, showToast])

  // Redirect if no player session for this room
  useEffect(() => {
    if (!myPlayerId) {
      router.push('/')
    }
  }, [myPlayerId, router])

  // Cleanup: remove player on unmount
  useEffect(() => {
    if (!myPlayerId) return
    const handleUnload = async () => {
      const supabase = createClient()
      await supabase.from('players').delete().eq('id', myPlayerId)
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [myPlayerId])

  if (roomLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-page)' }}>
        <Spinner />
      </div>
    )
  }

  if (!room) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-page)' }}>
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)' }}>Redirection…</p>
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      </div>
    )
  }

  const phase = room.phase as 'waiting' | 'voting' | 'revealed'
  const isScrumMaster = myRole === 'scrum-master'
  const myVote = votes.find(v => v.player_id === myPlayerId)
  const currentVote = myVote?.value ?? selectedVote

  return (
    <div className="layout-room">
      <RoomHeader room={room} connected={true} />

      <div className="layout-room-grid">
        {/* Colonne gauche — participants */}
        <div className="flex flex-col gap-4">
          <PlayersList
            players={players}
            votes={votes}
            phase={phase}
            myPlayerId={myPlayerId}
          />
        </div>

        {/* Colonne droite — story + vote + status */}
        <div className="flex flex-col gap-4">
          <StoryPanel
            roomId={roomId}
            story={room.story}
            phase={phase}
            isScrumMaster={isScrumMaster}
          />

          {myRole === 'developer' && (
            <VoteGrid
              roomId={roomId}
              round={room.round}
              phase={phase}
              myPlayerId={myPlayerId}
              myRole={myRole}
              currentVote={currentVote ?? null}
            />
          )}

          <StatusBar
            roomId={roomId}
            phase={phase}
            round={room.round}
            players={players}
            votes={votes}
            isScrumMaster={isScrumMaster}
          />
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
