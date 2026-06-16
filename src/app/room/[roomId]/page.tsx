'use client'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
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
import { useGameStore, useRoomSession } from '@/store/gameStore'
import { getScale } from '@/lib/game/scales'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { fmt } from '@/lib/i18n/interpolate'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const { dict } = useI18n()
  const roomId = params.roomId as string
  const { toast, showToast, clearToast } = useToast()

  // L'URL fait foi : on lit la session de CETTE room précise, pas une session
  // globale qui pourrait pointer vers une autre room en cache.
  const session = useRoomSession(roomId)
  const myPlayerId = session?.playerId ?? null
  const myRole = session?.role ?? null
  const { selectedVote, setSelectedVote, leaveRoom } = useGameStore()
  const hydrated = useSyncExternalStore(
    cb => useGameStore.persist.onFinishHydration(cb),
    () => useGameStore.persist.hasHydrated(),
    () => false,
  )

  const { room, loading: roomLoading } = useRoom(roomId)
  const { players } = usePlayers(roomId)
  const { stories } = useStories(roomId)

  // Vue historique : strictement locale au SM qui consulte. Aucun broadcast.
  // Les autres clients (dev + autres SM) continuent de voir le round live.
  // Seule la ré-ouverture explicite ("Rouvrir le vote pour tout le monde")
  // propage en écrivant dans rooms.round / phase / story.
  const [viewingRound, setViewingRound] = useState<number | null>(null)
  const isScrumMaster = myRole === 'scrum-master'

  const displayRound = viewingRound ?? room?.round ?? 1
  const isHistoryMode = viewingRound !== null
  const historyStory = isHistoryMode ? stories.find(s => s.round === viewingRound) : null
  const displayPhase: 'waiting' | 'voting' | 'revealed' = isHistoryMode
    ? 'revealed'
    : (room?.phase as 'waiting' | 'voting' | 'revealed' | undefined) ?? 'waiting'
  const displayStory = isHistoryMode ? (historyStory?.title ?? '') : (room?.story ?? '')
  // Ligne stories du round affiché, source de la durée de vote enregistrée.
  const displayStoryRow = stories.find(s => s.round === displayRound) ?? null

  const { votes } = useVotes(roomId, displayRound)

  useEffect(() => {
    if (!roomLoading && !room) {
      showToast(dict.room.page.roomNotFound)
      setTimeout(() => router.push('/app'), 1500)
    }
  }, [room, roomLoading, router, showToast, dict])

  useEffect(() => {
    if (!hydrated) return
    // Pas de session pour cette room : je dois la rejoindre. On envoie vers le
    // lobby avec la room pré-remplie. On ne renvoie jamais vers une autre room
    // déjà en cache, l'URL demandée prime.
    if (!session) {
      router.replace(`/app?room=${encodeURIComponent(roomId)}`)
    }
  }, [hydrated, session, roomId, router])

  useEffect(() => {
    if (!hydrated || !session || !players.length) return
    const stillExists = players.some(p => p.id === session.playerId)
    if (!stillExists) {
      leaveRoom(roomId)
      router.replace(`/app?room=${encodeURIComponent(roomId)}`)
    }
  }, [hydrated, session, players, leaveRoom, roomId, router])

  // Backfill SM-side : pour les rounds qui ont des votes mais pas de ligne
  // stories (rounds révélés avant la migration timeline), on crée le snapshot
  // depuis les votes existants. Titre perdu (rooms.story est resetté au round
  // suivant), laissé vide, la timeline affichera '(titre perdu)'.
  const backfilledRef = useRef(false)
  useEffect(() => {
    if (backfilledRef.current) return
    if (!isScrumMaster || !room || !players.length) return
    backfilledRef.current = true
    const supabase = createClient()
    const backfillScale = getScale(room.scale_id, room.scale_values)
    ;(async () => {
      const { data: allVotes } = await supabase
        .from('votes')
        .select('id,room_id,player_id,round,value,created_at')
        .eq('room_id', roomId)
      if (!allVotes) return
      const liveRoundLocal = room.round
      const byRound = new Map<number, typeof allVotes>()
      for (const v of allVotes) {
        if (v.round >= liveRoundLocal) continue
        const list = byRound.get(v.round) ?? []
        list.push(v)
        byRound.set(v.round, list)
      }
      const existing = new Set(stories.map(s => s.round))
      for (const [r, vs] of byRound) {
        if (existing.has(r)) continue
        const stats = computeRevealStats(backfillScale, players, vs)
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

  // Quand un dev voit son vote ré-ouvert (par le SM en displayPhase=='revealed'),
  // on remet à zéro le selectedVote optimiste pour repartir d'une grille vierge.
  const reopenedTrigger = myRole === 'developer'
    && displayPhase === 'revealed'
    && !votes.some(v => v.player_id === myPlayerId && v.value !== '')
  useEffect(() => {
    if (reopenedTrigger && selectedVote) setSelectedVote(null)
  }, [reopenedTrigger, selectedVote, setSelectedVote])

  // Reset du vote optimiste à chaque changement de round affiché (next round
  // côté SM, ou navigation timeline locale). Sinon la carte du round précédent
  // reste surlignée sur une grille fraîche.
  useEffect(() => {
    setSelectedVote(null)
  }, [displayRound, setSelectedVote])

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
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)' }}>{dict.room.page.redirecting}</p>
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      </div>
    )
  }

  const scale = getScale(room.scale_id, room.scale_values)
  const myVoteRow = votes.find(v => v.player_id === myPlayerId)
  const myActiveVote = myVoteRow && myVoteRow.value !== '' ? myVoteRow : undefined
  const reopenedForMe = myRole === 'developer' && displayPhase === 'revealed' && !myActiveVote
  const showVoteGrid = myRole === 'developer' && (displayPhase !== 'revealed' || reopenedForMe)
  const currentVote = reopenedForMe ? null : (myActiveVote?.value ?? selectedVote)

  // Session terminée → bascule de toute la room en mode recap pour tout le monde.
  if (room.ended_at) {
    return (
      <div className="layout-room">
        <RoomHeader
          room={room}
          connected={true}
          displayRound={displayRound}
          displayPhase="revealed"
          isHistoryMode={false}
          votingSeconds={displayStoryRow?.voting_seconds ?? null}
        />
        <SessionRecap
          roomId={roomId}
          players={players}
          stories={stories}
          endedAt={room.ended_at}
          scale={scale}
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
        votingSeconds={displayStoryRow?.voting_seconds ?? null}
      />

      <div className={isScrumMaster ? 'layout-room-grid layout-room-grid--with-timeline' : 'layout-room-grid'}>
        {/* Colonne gauche, participants */}
        <div className="flex flex-col gap-4">
          <PlayersList
            players={players}
            votes={votes}
            phase={displayPhase}
            myPlayerId={myPlayerId}
          />
        </div>

        {/* Colonne centre, story + vote + status */}
        <div className="flex flex-col gap-4">
          {isHistoryMode && (
            <HistoryBanner
              roomId={roomId}
              viewingRound={viewingRound!}
              liveRound={room.round}
              storyTitle={historyStory?.title ?? ''}
              onExit={() => setViewingRound(null)}
              onReopenForAll={() => setViewingRound(null)}
              showToast={showToast}
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
              scale={scale}
            />
          )}

          {displayPhase === 'revealed' && (
            <RevealDashboard
              players={players}
              votes={votes}
              round={displayRound}
              roomId={roomId}
              isScrumMaster={isScrumMaster}
              scale={scale}
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
            scale={scale}
            timerStartedAt={room.timer_started_at}
          />
        </div>

        {/* Colonne droite, timeline SM uniquement */}
        {isScrumMaster && (
          <StoryTimeline
            stories={stories}
            liveRound={room.round}
            livePhase={room.phase as 'waiting' | 'voting' | 'revealed'}
            liveStory={room.story}
            viewingRound={viewingRound}
            onSelect={setViewingRound}
          />
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <RevealOverlay phase={displayPhase} />
    </div>
  )
}

interface HistoryBannerProps {
  roomId: string
  viewingRound: number
  liveRound: number
  storyTitle: string
  onExit: () => void
  onReopenForAll: () => void
  showToast: (message: string, type?: 'success' | 'error') => void
}

function HistoryBanner({
  roomId,
  viewingRound,
  liveRound,
  storyTitle,
  onExit,
  onReopenForAll,
  showToast,
}: HistoryBannerProps) {
  const { dict } = useI18n()
  const tb = dict.room.historyBanner
  const [busy, setBusy] = useState<null | 'exit' | 'reopen'>(null)

  async function reopenForAll() {
    if (busy) return
    setBusy('reopen')
    const supabase = createClient()
    const { error: roomErr } = await supabase
      .from('rooms')
      .update({ phase: 'voting', round: viewingRound, story: storyTitle, timer_started_at: new Date().toISOString() })
      .eq('id', roomId)
    if (roomErr) {
      showToast(fmt(tb.reopenFailed, { msg: roomErr.message }), 'error')
      setBusy(null)
      return
    }
    // Vide les votes du round ré-ouvert pour repartir d'une grille fraîche.
    // value='' (pas un DELETE), c'est le pattern déjà utilisé par la
    // ré-ouverture per-player et la RLS UPDATE le permet.
    const { error: votesErr } = await supabase
      .from('votes')
      .update({ value: '' })
      .eq('room_id', roomId)
      .eq('round', viewingRound)
    if (votesErr) {
      showToast(fmt(tb.reopenPartial, { msg: votesErr.message }), 'error')
    }
    onReopenForAll()
    setBusy(null)
  }

  function exit() {
    if (busy) return
    onExit()
  }

  return (
    <div className="history-banner">
      <span className="history-banner__icon" aria-hidden>📜</span>
      <div className="history-banner__body">
        <strong>{fmt(tb.title, { round: viewingRound })}</strong>
        <p>{fmt(tb.body, { liveRound })}</p>
      </div>
      <div className="history-banner__actions">
        <button
          type="button"
          className="history-banner__cta history-banner__cta--primary"
          onClick={reopenForAll}
          disabled={busy !== null}
          title={tb.reopenForAllTitle}
        >
          {busy === 'reopen' ? '…' : tb.reopenForAll}
        </button>
        <button
          type="button"
          className="history-banner__cta"
          onClick={exit}
          disabled={busy !== null}
        >
          {tb.back}
        </button>
      </div>
    </div>
  )
}
