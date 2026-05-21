export const PLAYER_EMOJIS = [
  '🦊', '🐱', '🐶', '🐼', '🐯', '🦁', '🐸', '🐙',
  '🦄', '🐲', '🦖', '🦅', '🐺', '🦝', '🦉', '🐢',
  '🐧', '🦦', '🦔', '🐝', '🦋', '🐳',
  '🚀', '🛸', '🌟', '⚡', '🔥', '💎',
  '🎮', '🕹️', '🎲', '🏆', '👑', '🎩',
  '🦸', '🧙', '🧛', '🤖', '👻', '🥷',
  '🍕', '🍩', '🌮', '🥑', '🌈', '🪐',
] as const

export type PlayerEmoji = (typeof PLAYER_EMOJIS)[number]

export function randomPlayerEmoji(exclude?: string | null): PlayerEmoji {
  const pool = exclude
    ? PLAYER_EMOJIS.filter(e => e !== exclude)
    : PLAYER_EMOJIS
  return pool[Math.floor(Math.random() * pool.length)] as PlayerEmoji
}
