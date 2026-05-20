import { z } from 'zod'

export const lobbySchema = z.object({
  name: z.string().min(1, 'Le prénom est requis').max(32, 'Prénom trop long'),
  role: z.enum(['developer', 'scrum-master']),
  roomId: z.string().min(1, 'L\'ID de room est requis').regex(/^[a-z]+-\d{3}$/, 'Format invalide (ex: alpha-421)'),
})

export type LobbyFormData = z.infer<typeof lobbySchema>
