'use client'
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
          {label}
        </label>
      )}
      <input className={`input-text-md ${className}`} {...props} />
      {error && (
        <span className="text-xs" style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-primary)' }}>
          {error}
        </span>
      )}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
          {label}
        </label>
      )}
      <textarea className={`input-textarea-md ${className}`} {...props} />
      {error && (
        <span className="text-xs" style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-primary)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
