'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RoomHeader } from '@/components/room/RoomHeader'
import { PlayersList } from '@/components/room/PlayersList'
import { StoryPanel } from '@/components/room/StoryPanel'
import { VoteGrid } from '@/components/room/VoteGrid'
import { StatusBar } from '@/components/room/StatusBar'
import { RevealOverlay } from '@/components/room/RevealOverlay'
import { RevealDashboard } from '@/components/room/RevealDashboard'
import { SessionRecap } from '@/components/room/SessionRecap'
import { StoryTimeline } from '@/components/room/StoryTimeline'
import { Toast, useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import { useRoom } from '@/hooks/useRoom'
import { usePlayers } from '@/hooks/usePlayers'
import { useVotes } from '@/hooks/useVotes'
import { useStories } from '@/hooks/useStories'
import { createClient } from '@/lib/supabase/client'
import { computeRevealStats } from '@/lib/game/reveal-stats'
import { useGameStore } from '@/store/gameStore'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { toast, showToast, clearToast } = useToast()

  const { myPlayerId, myRoomId, myRole, selectedVote, setSelectedVote, reset } = useGameStore()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])

  const { room, loading: roomLoading } = useRoom(roomId)
  const { players } = usePlayers(roomId)
  const { stories } = useStories(roomId)

  // History mode: when SM has clicked a past story, all clients display that
  // round in 'revealed' phase. The "live" round (room.round / room.phase) is
  // preserved untouched — only the displayed view changes.
  const viewingRound = room?.viewing_round ?? null
  const displayRound = viewingRound ?? room?.round ?? 1
  const isHistoryMode = viewingRound !== null
  const historyStory = isHistoryMode ? stories.find(s => s.round === viewingRound) : null
  const displayPhase: 'waiting' | 'voting' | 'revealed' = isHistoryMode
    ? 'revealed'
    : (room?.phase as 'waiting' | 'voting' | 'revealed' | undefined) ?? 'waiting'
  const displayStory = isHistoryMode ? (historyStory?.title ?? '') : (room?.story ?? '')

  const { votes } = useVotes(roomId, displayRound)

  useEffect(() => {
    if (!roomLoading && !room) {
      showToast('Room introuvable')
      setTimeout(() => router.push('/'), 1500)
    }
  }, [room, roomLoading, router, showToast])

  useEffect(() => {
    if (!hydrated) return
    if (!myPlayerId || (myRoomId && myRoomId !== roomId)) {
      router.push('/')
    }
  }, [hydrated, myPlayerId, myRoomId, roomId, router])

  useEffect(() => {
    if (!hydrated || !myPlayerId || !players.length) return
    const stillExists = players.some(p => p.id === myPlayerId)
    if (!stillExists) {
      reset()
      router.push('/')
    }
  }, [hydrated, myPlayerId, players, reset, router])

  // Backfill: SM-side, on mount, detect rounds with votes but no stories row
  // (e.g. rounds revealed before the timeline migration was applied) and create
  // the snapshot from existing votes. Title is lost (rooms.story was reset on
  // next round) — we leave it empty so the timeline shows '(titre perdu)'.
  const backfilledRef = useRef(false)
  const isScrumMaster = myRole === 'scrum-master'
  useEffect(() => {
    if (backfilledRef.current) return
    if (!isScrumMaster || !room || !players.length) return
    backfilledRef.current = true
    const supabase = createClient()
    ;(async () => {
      const { data: allVotes } = await supabase
        .from('votes')
        .select('id,room_id,player_id,round,value,created_at')
        .eq('room_id', roomId)
      if (!allVotes) return
      const liveRoundLocal = room.round
      const byRound = new Map<number, typeof allVotes>()
      for (const v of allVotes) {
        if (v.round >= liveRoundLocal) continue // skip current live round
        const list = byRound.get(v.round) ?? []
        list.push(v)
        byRound.set(v.round, list)
      }
      const existing = new Set(stories.map(s => s.round))
      for (const [r, vs] of byRound) {
        if (existing.has(r)) continue
        const stats = computeRevealStats(players, vs)
        await supabase.from('stories').upsert({
          room_id: roomId,
          round: r,
          title: '',
          final_mean: stats.mean,
          consensus: stats.consensus,
        }, { onConflict: 'room_id,round' })
      }
    })()
  }, [isScrumMaster, room, players, stories, roomId])

  // When a developer's vote gets re-opened (by the SM, in displayPhase==='revealed'),
  // clear the local optimistic selectedVote so the re-shown grid starts unselected.
  const reopenedTrigger = myRole === 'developer'
    && displayPhase === 'revealed'
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

  const myVoteRow = votes.find(v => v.player_id === myPlayerId)
  const myActiveVote = myVoteRow && myVoteRow.value !== '' ? myVoteRow : undefined
  const reopenedForMe = myRole === 'developer' && displayPhase === 'revealed' && !myActiveVote
  const showVoteGrid = myRole === 'developer' && (displayPhase !== 'revealed' || reopenedForMe)
  const currentVote = reopenedForMe ? null : (myActiveVote?.value ?? selectedVote)

  // Session ended → switch the whole room into "recap mode" for everyone.
  if (room.ended_at) {
    return (
      <div className="layout-room">
        <RoomHeader
          room={room}
          connected={true}
          displayRound={displayRound}
          displayPhase="revealed"
          isHistoryMode={false}
        />
        <SessionRecap
          roomId={roomId}
          players={players}
          stories={stories}
          endedAt={room.ended_at}
        />
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      </div>
    )
  }

  return (
    <div className="layout-room">
      <RoomHeader
        room={room}
        connected={true}
        displayRound={displayRound}
        displayPhase={displayPhase}
        isHistoryMode={isHistoryMode}
      />

      <div className={isScrumMaster ? 'layout-room-grid layout-room-grid--with-timeline' : 'layout-room-grid'}>
        {/* Colonne gauche — participants */}
        <div className="flex flex-col gap-4">
          <PlayersList
            players={players}
            votes={votes}
            phase={displayPhase}
            myPlayerId={myPlayerId}
          />
        </div>

        {/* Colonne centre — story + vote + status */}
        <div className="flex flex-col gap-4">
          {isHistoryMode && (
            <HistoryBanner
              roomId={roomId}
              viewingRound={viewingRound!}
              liveRound={room.round}
            />
          )}

          <StoryPanel
            roomId={roomId}
            story={displayStory}
            phase={displayPhase}
            isScrumMaster={isScrumMaster}
            historyRound={isHistoryMode ? viewingRound : null}
          />

          {showVoteGrid && (
            <VoteGrid
              roomId={roomId}
              round={displayRound}
              phase={displayPhase}
              reopened={reopenedForMe}
              myPlayerId={myPlayerId}
              myRole={myRole}
              currentVote={currentVote ?? null}
            />
          )}

          {displayPhase === 'revealed' && (
            <RevealDashboard
              players={players}
              votes={votes}
              round={displayRound}
              roomId={roomId}
              isScrumMaster={isScrumMaster}
              storyTitle={displayStory}
              currentStory={stories.find(s => s.round === displayRound) ?? null}
            />
          )}

          <StatusBar
            roomId={roomId}
            phase={displayPhase}
            round={displayRound}
            liveRound={room.round}
            isHistoryMode={isHistoryMode}
            story={displayStory}
            players={players}
            votes={votes}
            isScrumMaster={isScrumMaster}
          />
        </div>

        {/* Colonne droite — timeline SM uniquement */}
        {isScrumMaster && (
          <StoryTimeline
            roomId={roomId}
            stories={stories}
            liveRound={room.round}
            livePhase={room.phase as 'waiting' | 'voting' | 'revealed'}
            liveStory={room.story}
            viewingRound={viewingRound}
          />
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <RevealOverlay phase={displayPhase} />
    </div>
  )
}

function HistoryBanner({ roomId, viewingRound, liveRound }: { roomId: string; viewingRound: number; liveRound: number }) {
  const [busy, setBusy] = useState(false)
  async function exit() {
    if (busy) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('rooms').update({ viewing_round: null }).eq('id', roomId)
    setBusy(false)
  }
  return (
    <div className="history-banner">
      <span className="history-banner__icon" aria-hidden>📜</span>
      <div className="history-banner__body">
        <strong>Vue historique — Round {viewingRound}</strong>
        <p>Tu peux relancer un vote ou modifier la story. Round live actuel : <strong>{liveRound}</strong>.</p>
      </div>
      <button type="button" className="history-banner__cta" onClick={exit} disabled={busy}>
        {busy ? '…' : '← Retour au round courant'}
      </button>
    </div>
  )
}
