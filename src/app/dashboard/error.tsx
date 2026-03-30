'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="flex flex-col items-center justify-center h-full py-20 gap-4"
    >
      <h2
        className="text-lg font-semibold"
        style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
      >
        Something went wrong
      </h2>
      <p className="text-sm" style={{ color: '#888888' }}>
        {error.message || 'An unexpected error occurred loading this page.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: '#57bb8A', color: '#0F0F0F' }}
      >
        Try again
      </button>
    </div>
  )
}
