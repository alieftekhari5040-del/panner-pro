import { useState, useEffect, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return { toasts, addToast }
}

export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'info' && 'ℹ️'}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
