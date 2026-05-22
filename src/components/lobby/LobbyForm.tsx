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
import { MAX_DEV } from '@/lib/game/constants'
import {
  PREDEFINED_SCALES,
  PREDEFINED_SCALE_IDS,
  parseCustomValues,
  getScale,
} from '@/lib/game/scales'
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
  const [scaleId, setScaleId] = useState<string>('fibonacci')
  const [customRaw, setCustomRaw] = useState<string>('')
  const [loading, setLoading] = useState(false)
  // Tant qu'on a une session persistée non vérifiée, on masque le formulaire.
  // État dérivé du store : si la vérif DB échoue, le reset() ci-dessous remet
  // myPlayerId à null et restoring repasse à false automatiquement.
  const restoring = !!(myPlayerId && myRoomId)

  // Si on a une session persistée, on vérifie que le player existe encore en
  // DB et on reprend. S'il a été supprimé (autre onglet, données stale), on
  // reset et le formulaire réapparaît.
  useEffect(() => {
    if (!myPlayerId || !myRoomId) return
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

    const customValues = scaleId === 'custom' ? parseCustomValues(customRaw) : null
    if (scaleId === 'custom' && (!customValues || customValues.length === 0)) {
      showToast('Échelle perso : ajoute au moins une valeur')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      // Upsert room — scale_id / scale_values ne sont appliqués qu'à la
      // création (ignoreDuplicates → no-op si la room existe déjà).
      const { error: roomError } = await supabase
        .from('rooms')
        .upsert(
          { id: roomId, scale_id: scaleId, scale_values: customValues },
          { onConflict: 'id', ignoreDuplicates: true },
        )
      if (roomError) throw roomError

      // Verify room exists
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id')
        .eq('id', roomId)
        .single()
      if (!roomData) { showToast('Room introuvable'); setLoading(false); return }

      // Check limits — devs are capped, Scrum Masters have no hard limit.
      if (role === 'developer') {
        const { count: devCount } = await supabase
          .from('players')
          .select('id', { count: 'exact', head: true })
          .eq('room_id', roomId)
          .eq('role', 'developer')
        if ((devCount ?? 0) >= MAX_DEV) {
          showToast(`Équipe complète — max ${MAX_DEV} développeurs par room`)
          setLoading(false)
          return
        }
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

        <ScalePicker
          scaleId={scaleId}
          onScaleChange={setScaleId}
          customRaw={customRaw}
          onCustomChange={setCustomRaw}
        />

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

interface ScalePickerProps {
  scaleId: string
  onScaleChange: (id: string) => void
  customRaw: string
  onCustomChange: (raw: string) => void
}

function ScalePicker({ scaleId, onScaleChange, customRaw, onCustomChange }: ScalePickerProps) {
  const preview = getScale(
    scaleId,
    scaleId === 'custom' ? parseCustomValues(customRaw) : null,
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium"
        style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}
      >
        Échelle d&apos;estimation
      </label>
      <select
        className="input-text-md"
        value={scaleId}
        onChange={e => onScaleChange(e.target.value)}
      >
        {PREDEFINED_SCALE_IDS.map(id => (
          <option key={id} value={id}>{PREDEFINED_SCALES[id].name}</option>
        ))}
        <option value="custom">Personnalisée…</option>
      </select>

      {scaleId === 'custom' && (
        <input
          className="input-text-md"
          placeholder="Ex: 1, 2, 4, 8, 16 ou XS, S, M, L"
          value={customRaw}
          onChange={e => onCustomChange(e.target.value)}
          style={{ marginTop: 4 }}
        />
      )}

      <div className="scale-preview" aria-label="Aperçu des cartes">
        {preview.values.length === 0 ? (
          <span className="scale-preview__empty">Saisis des valeurs séparées par des virgules.</span>
        ) : (
          preview.values.map((v, i) => (
            <span key={`${v}-${i}`} className="scale-preview__chip">{String(v)}</span>
          ))
        )}
      </div>
    </div>
  )
}
