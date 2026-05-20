'use client'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const cls = type === 'success' ? 'toast-success' : 'toast-error'
  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div
      className={`${cls} fixed bottom-6 right-6 z-50 flex items-center gap-2 min-w-64 max-w-sm`}
      style={{ animation: 'slideIn 0.2s ease' }}
    >
      <span className="font-bold">{icon}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto opacity-60 hover:opacity-100"
        style={{ fontFamily: 'var(--font-primary)', fontSize: '16px' }}
      >
        ×
      </button>
    </div>
  )
}

interface ToastState {
  message: string
  type: 'success' | 'error'
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  function showToast(message: string, type: 'success' | 'error' = 'error') {
    setToast({ message, type })
  }

  function clearToast() {
    setToast(null)
  }

  return { toast, showToast, clearToast }
}
