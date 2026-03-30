'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0F0F0F' }}
    >
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold" style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}>
          Something went wrong
        </h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg text-sm font-medium"
          style={{ background: '#57bb8A', color: '#0F0F0F' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
