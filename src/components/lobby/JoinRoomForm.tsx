'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast, useToast } from '@/components/ui/Toast'
import { RoleSelector } from './RoleSelector'
import { EmojiPicker } from './EmojiPicker'
import { useSession } from '@/hooks/useSession'
import { useGameStore } from '@/store/gameStore'
import { createClient } from '@/lib/supabase/client'
import { randomPlayerEmoji } from '@/lib/game/emojis'
import { MAX_DEV } from '@/lib/game/constants'
import type { Player, Role, Room } from '@/types'

interface JoinRoomFormProps {
  roomId: string
  /** Realtime-synced room (réutilise la souscription du parent pour éviter un double channel). */
  room: Room
  /** Realtime-synced players (idem). */
  players: Player[]
}

export function JoinRoomForm({ roomId, room, players }: JoinRoomFormProps) {
  const router = useRouter()
  const { userId, loading: sessionLoading } = useSession()
  const { toast, showToast, clearToast } = useToast()
  const { setMyName, setMyRole, setMyPlayerId, setMyRoomId, setMyEmoji, reset } = useGameStore()

  const [name, setName] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [emoji, setEmoji] = useState<string>(() => randomPlayerEmoji())
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { showToast('Le prénom est requis'); return }
    if (!role) { showToast('Choisir un rôle'); return }
    if (!userId) { showToast('Session non prête, réessaie'); return }

    setLoading(true)
    const supabase = createClient()

    try {
      // Vérifie que la room existe toujours.
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id')
        .eq('id', roomId)
        .single()
      if (!roomData) { showToast('Room introuvable'); setLoading(false); return }

      if (role === 'developer') {
        const { count: devCount } = await supabase
          .from('players')
          .select('id', { count: 'exact', head: true })
          .eq('room_id', roomId)
          .eq('role', 'developer')
        if ((devCount ?? 0) >= MAX_DEV) {
          showToast(`Équipe complète, max ${MAX_DEV} développeurs par room`)
          setLoading(false)
          return
        }
      }

      const { data: existing } = await supabase
        .from('players')
        .select('id')
        .eq('room_id', roomId)
        .eq('name', name.trim())
        .single()
      if (existing) {
        showToast('Ce prénom est déjà utilisé dans cette room')
        setLoading(false)
        return
      }

      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({ room_id: roomId, name: name.trim(), role, user_id: userId, emoji })
        .select()
        .single()
      if (playerError) {
        if (playerError.code === '23505') {
          showToast('Ce prénom est déjà utilisé dans cette room')
        } else {
          showToast('Erreur lors de la connexion')
        }
        setLoading(false)
        return
      }

      // Si on traînait une session pour une autre room, on la repart proprement.
      reset()
      setMyName(name.trim())
      setMyRole(role)
      setMyPlayerId(player.id)
      setMyRoomId(roomId)
      setMyEmoji(emoji)
      // Pas de router.push, on est déjà sur /room/[roomId].
    } catch {
      showToast('Une erreur est survenue')
      setLoading(false)
    }
  }

  const smCount = players.filter(p => p.role === 'scrum-master').length
  const devCount = players.filter(p => p.role === 'developer').length
  const total = smCount + devCount
  const ended = !!room.ended_at

  let bannerEmoji = '👋'
  let bannerTitle: string
  if (ended) {
    bannerEmoji = '🏁'
    bannerTitle = 'Session terminée'
  } else if (total === 0) {
    bannerEmoji = '✨'
    bannerTitle = 'Tu lances la session, prends les commandes !'
  } else if (smCount === 0) {
    bannerEmoji = '🧑‍💻'
    bannerTitle = devCount === 1
      ? '1 dev attend un Scrum Master, ça pourrait être toi ?'
      : `${devCount} devs attendent un Scrum Master, ça pourrait être toi ?`
  } else if (devCount === 0) {
    bannerEmoji = '🎯'
    bannerTitle = smCount === 1
      ? 'Un Scrum Master est déjà là, viens compléter la team !'
      : `${smCount} Scrum Masters sont déjà là, viens compléter la team !`
  } else {
    bannerEmoji = '🎉'
    bannerTitle = total === 1
      ? 'L\'équipe t\'attend, saute dans la partie !'
      : `${total} personnes t'attendent déjà, saute dans la partie !`
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="room-preview-banner" aria-live="polite">
          <span className="room-preview-banner__title">
            <span aria-hidden>{bannerEmoji}</span> {bannerTitle}
          </span>
          <span className="room-preview-banner__room">
            Room <strong>{roomId}</strong>
          </span>
          {!ended && total > 0 && (
            <div className="room-preview-banner__stats">
              <span className="room-preview-banner__chip" title="Scrum Master(s) déjà connecté(s)">
                <span aria-hidden>🎯</span> {smCount} {smCount === 1 ? 'Scrum Master' : 'Scrum Masters'}
              </span>
              <span className="room-preview-banner__chip" title="Développeur·s déjà connecté·s">
                <span aria-hidden>🧑‍💻</span> {devCount} {devCount === 1 ? 'développeur' : 'développeurs'}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Prénom"
          placeholder="Ex: Sophie"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={32}
          autoFocus
        />

        <EmojiPicker value={emoji} onChange={setEmoji} />

        <RoleSelector value={role} onChange={setRole} />

        <Button
          type="submit"
          variant="primary"
          loading={loading || sessionLoading}
          disabled={loading || sessionLoading}
          className="w-full mt-2"
        >
          Rejoindre
        </Button>
      </form>

      <div className="join-form-alts">
        <span className="join-form-alts__sep" aria-hidden>ou</span>
        <div className="join-form-alts__row">
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={() => { reset(); router.push('/app') }}
          >
            Rejoindre une autre Room
          </button>
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={() => { reset(); router.push('/app?new=1') }}
          >
            Créer une Room
          </button>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}
    </>
  )
}
