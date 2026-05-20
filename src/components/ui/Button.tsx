'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'reveal'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary-md',
  secondary: 'btn-secondary-md',
  ghost: 'btn-ghost-sm',
  danger: 'btn-danger-md',
  reveal: 'btn-reveal-lg',
}

export function Button({ variant = 'primary', loading, children, disabled, className = '', ...props }: ButtonProps) {
  const cls = variantClass[variant]
  return (
    <button
      className={`${cls} ${className} inline-flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
