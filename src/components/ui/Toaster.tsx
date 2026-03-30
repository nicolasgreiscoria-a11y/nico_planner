'use client'

import { useToast, ToastType } from '@/lib/context/ToastContext'

const TOAST_STYLE: Record<ToastType, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  success: {
    color: '#57bb8A',
    bg: '#57bb8A12',
    border: '#57bb8A33',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#57bb8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7l3.5 3.5L12 3" />
      </svg>
    ),
  },
  error: {
    color: '#E67C73',
    bg: '#E67C7312',
    border: '#E67C7333',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#E67C73" strokeWidth="2" strokeLinecap="round">
        <path d="M3 3l8 8M11 3L3 11" />
      </svg>
    ),
  },
  info: {
    color: '#888888',
    bg: '#88888812',
    border: '#88888833',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round">
        <circle cx="7" cy="7" r="5.5" />
        <path d="M7 6.5v4M7 4.5v.5" />
      </svg>
    ),
  },
}

export function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        const s = TOAST_STYLE[toast.type]
        return (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl pointer-events-auto"
            style={{
              background: '#1A1A1A',
              border: `1px solid ${s.border}`,
              minWidth: 220,
              maxWidth: 360,
              animation: 'slideInRight 0.2s ease-out',
            }}
          >
            <span className="shrink-0">{s.icon}</span>
            <span className="flex-1 text-sm" style={{ color: s.color, fontFamily: 'IBM Plex Sans, sans-serif' }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded transition-opacity hover:opacity-70"
              style={{ color: '#555555' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 2l8 8M10 2L2 10" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
