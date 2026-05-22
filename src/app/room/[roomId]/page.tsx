'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RoomHeader } from '@/components/room/RoomHeader'
import { PlayersList } from '@/components/room/PlayersList'
import { StoryPanel } from '@/components/room/StoryPanel'
import { VoteGrid } from '@/components/room/VoteGrid'
import { StatusBar } from '@/components/room/StatusBar'
import { RevealOverlay } from '@/components/room/RevealOverlay'
import { RevealDashboard } from '@/components/room/RevealDashboard'
import { Toast, useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import { useRoom } from '@/hooks/useRoom'
import { usePlayers } from '@/hooks/usePlayers'
import { useVotes } from '@/hooks/useVotes'
import { useGameStore } from '@/store/gameStore'
import { getScale } from '@/lib/game/scales'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { toast, showToast, clearToast } = useToast()

  const { myPlayerId, myRoomId, myRole, selectedVote, setSelectedVote, reset } = useGameStore()
  // Wait for zustand's persisted state to hydrate before deciding to redirect.
  // Otherwise an immediate "no session" bounce fires on first render after refresh.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])

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

  // Redirect if no player session, OR session belongs to a different room.
  useEffect(() => {
    if (!hydrated) return
    if (!myPlayerId || (myRoomId && myRoomId !== roomId)) {
      router.push('/')
    }
  }, [hydrated, myPlayerId, myRoomId, roomId, router])

  // If the persisted player no longer exists in DB (e.g. removed elsewhere), clear
  // the session and bounce back to the lobby so the user can re-join cleanly.
  useEffect(() => {
    if (!hydrated || !myPlayerId || !players.length) return
    const stillExists = players.some(p => p.id === myPlayerId)
    if (!stillExists) {
      reset()
      router.push('/')
    }
  }, [hydrated, myPlayerId, players, reset, router])

  // When the SM re-opens a developer's vote (sets vote.value to '' — our "no
  // vote" sentinel), clear the local optimistic selectedVote so the re-shown
  // grid starts unselected rather than showing the previous pick highlighted.
  const reopenedTrigger = myRole === 'developer'
    && room?.phase === 'revealed'
    && !votes.some(v => v.player_id === myPlayerId && v.value !== '')
  useEffect(() => {
    if (reopenedTrigger && selectedVote) setSelectedVote(null)
  }, [reopenedTrigger, selectedVote, setSelectedVote])

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
  const scale = getScale(room.scale_id, room.scale_values)
  const myVoteRow = votes.find(v => v.player_id === myPlayerId)
  // A vote row with empty value is the SM's "reopened" sentinel — treat it as
  // if we hadn't voted yet.
  const myActiveVote = myVoteRow && myVoteRow.value !== '' ? myVoteRow : undefined
  // A developer whose vote was cleared by the SM in revealed phase ("re-voter")
  // should see the VoteGrid again, even though the global phase is still 'revealed'.
  const reopenedForMe = myRole === 'developer' && phase === 'revealed' && !myActiveVote
  const showVoteGrid = myRole === 'developer' && (phase !== 'revealed' || reopenedForMe)
  // Don't fall back to the locally-cached selectedVote when we're re-opened — the
  // user is supposed to start from a clean slate, not see their previous pick still
  // highlighted.
  const currentVote = reopenedForMe ? null : (myActiveVote?.value ?? selectedVote)

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

          {showVoteGrid && (
            <VoteGrid
              roomId={roomId}
              round={room.round}
              phase={phase}
              reopened={reopenedForMe}
              myPlayerId={myPlayerId}
              myRole={myRole}
              currentVote={currentVote ?? null}
              scale={scale}
            />
          )}

          {phase === 'revealed' && (
            <RevealDashboard
              players={players}
              votes={votes}
              round={room.round}
              roomId={roomId}
              isScrumMaster={isScrumMaster}
              scale={scale}
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
      <RevealOverlay phase={phase} />
    </div>
  )
}
