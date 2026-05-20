'use client'

interface VoteCardProps {
  value: string
  selected: boolean
  disabled: boolean
  onClick?: () => void
}

export function VoteCard({ value, selected, disabled, onClick }: VoteCardProps) {
  let cls = 'vote-card-default'
  if (disabled) cls = 'vote-card-disabled'
  else if (selected) cls = 'vote-card-selected'

  return (
    <button
      type="button"
      className={cls}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {value}
    </button>
  )
}
