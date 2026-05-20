import type { Vote } from '@/types'

export function calcMean(votes: Vote[]): string | null {
  const nums = votes
    .map(v => v.value)
    .filter(v => v !== '?')
    .map(Number)
    .filter(n => !isNaN(n))
  if (!nums.length) return null
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
}

export function generateRoomId(): string {
  const words = [
    'alpha', 'beta', 'gamma', 'delta', 'echo', 'foxtrot',
    'hotel', 'india', 'juliet', 'kilo', 'lima', 'mike',
    'november', 'oscar', 'papa', 'quebec', 'romeo', 'sierra',
    'tango', 'uniform', 'victor', 'whiskey', 'yankee', 'zulu',
  ]
  const word = words[Math.floor(Math.random() * words.length)]
  const num = Math.floor(Math.random() * 900) + 100
  return `${word}-${num}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
