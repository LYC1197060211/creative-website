'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg
        ${typeStyles[toast.type]}
        transition-all duration-300 ease-in-out transform
        animate-slide-up
      `}
    >
      <span className="text-lg">{typeIcons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-2 text-current hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  )
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast['type'] = 'info', duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, message, type, duration }

    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration)
  const showError = (message: string, duration?: number) => addToast(message, 'error', duration)
  const showWarning = (message: string, duration?: number) => addToast(message, 'warning', duration)
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}