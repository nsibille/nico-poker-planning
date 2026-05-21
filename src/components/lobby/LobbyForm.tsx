'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/Spinner'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast, useToast } from '@/components/ui/Toast'
import { RoleSelector } from './RoleSelector'
import { EmojiPicker } from './EmojiPicker'
import { useSession } from '@/hooks/useSession'
import { useGameStore } from '@/store/gameStore'
import { createClient } from '@/lib/supabase/client'
import { generateRoomId } from '@/lib/game/utils'
import { randomPlayerEmoji } from '@/lib/game/emojis'
import { MAX_DEV, MAX_SM } from '@/lib/game/constants'
import type { Role } from '@/types'

export function LobbyForm() {
  const router = useRouter()
  const { userId, loading: sessionLoading } = useSession()
  const { toast, showToast, clearToast } = useToast()
  const { myPlayerId, myRoomId, setMyName, setMyRole, setMyPlayerId, setMyRoomId, setMyEmoji, reset } = useGameStore()

  const [name, setName] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [roomId, setRoomId] = useState('')
  const [emoji, setEmoji] = useState<string>(() => randomPlayerEmoji())
  const [loading, setLoading] = useState(false)
  // While we check a persisted session against the DB, hide the form to avoid a flash.
  const [restoring, setRestoring] = useState<boolean>(!!(myPlayerId && myRoomId))

  // If we have a persisted session, verify the player still exists in DB and resume.
  // If the player was deleted (e.g. cleared from another tab, or stale data), reset and
  // show the lobby form so the user can re-join.
  useEffect(() => {
    if (!myPlayerId || !myRoomId) { setRestoring(false); return }
    let cancelled = false
    const supabase = createClient()
    ;(async () => {
      const { data } = await supabase
        .from('players')
        .select('id, room_id')
        .eq('id', myPlayerId)
        .maybeSingle()
      if (cancelled) return
      if (data && data.room_id === myRoomId) {
        router.replace(`/room/${myRoomId}`)
      } else {
        reset()
        setRestoring(false)
      }
    })()
    return () => { cancelled = true }
  }, [myPlayerId, myRoomId, reset, router])

  const handleGenerate = useCallback(() => {
    setRoomId(generateRoomId())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { showToast('Le prénom est requis'); return }
    if (!role) { showToast('Choisir un rôle'); return }
    if (!roomId.trim()) { showToast('L\'ID de room est requis'); return }
    if (!userId) { showToast('Session non prête, réessaie'); return }

    setLoading(true)
    const supabase = createClient()

    try {
      // Upsert room
      const { error: roomError } = await supabase
        .from('rooms')
        .upsert({ id: roomId }, { onConflict: 'id', ignoreDuplicates: true })
      if (roomError) throw roomError

      // Verify room exists
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id')
        .eq('id', roomId)
        .single()
      if (!roomData) { showToast('Room introuvable'); setLoading(false); return }

      // Check limits
      const { count: roleCount } = await supabase
        .from('players')
        .select('id', { count: 'exact', head: true })
        .eq('room_id', roomId)
        .eq('role', role)
      const limit = role === 'developer' ? MAX_DEV : MAX_SM
      if ((roleCount ?? 0) >= limit) {
        showToast(`Room complète pour ce rôle (max ${limit})`)
        setLoading(false)
        return
      }

      // Check duplicate name
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

      // Insert player
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

      setMyName(name.trim())
      setMyRole(role)
      setMyPlayerId(player.id)
      setMyRoomId(roomId)
      setMyEmoji(emoji)
      router.push(`/room/${roomId}`)
    } catch {
      showToast('Une erreur est survenue')
      setLoading(false)
    }
  }

  if (restoring) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: '12px' }}>
        <Spinner />
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Reprise de ta session…
        </p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
            ID de Room
          </label>
          <div className="flex gap-2">
            <input
              className="input-text-md"
              placeholder="Ex: alpha-421"
              value={roomId}
              onChange={e => setRoomId(e.target.value.toLowerCase())}
              pattern="[a-z]+-[0-9]{3}"
            />
            <button
              type="button"
              onClick={handleGenerate}
              className="btn-secondary-md whitespace-nowrap"
            >
              Générer
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading || sessionLoading}
          disabled={loading || sessionLoading}
          className="w-full mt-2"
        >
          Rejoindre la room
        </Button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}
    </>
  )
}
