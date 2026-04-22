'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function GoogleCalendarSection() {
  const t = useTranslations('settings')
  const searchParams = useSearchParams()
  const [connected, setConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)

  const loadStatus = useCallback(async () => {
    const res = await fetch('/api/auth/google/status')
    if (res.ok) {
      const data = await res.json()
      setConnected(data.connected)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  // Reflect URL param after OAuth redirect
  useEffect(() => {
    const param = searchParams.get('google')
    if (param === 'connected') setConnected(true)
    if (param === 'error') setConnected(false)
  }, [searchParams])

  async function handleDisconnect() {
    setDisconnecting(true)
    await fetch('/api/auth/google', { method: 'DELETE' })
    setConnected(false)
    setDisconnecting(false)
  }

  return (
    <div className="space-y-4">
      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: connected ? '#57bb8A' : '#555555' }}
          />
          <span className="text-sm" style={{ color: '#E8E8E8' }}>
            {loading
              ? '...'
              : connected
              ? t('calendarConnected')
              : t('calendarNotConnected')}
          </span>
        </div>

        {!loading && (
          connected ? (
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-[#2A2A2A] disabled:opacity-50"
              style={{ color: '#E67C73', border: '1px solid #E67C7333' }}
            >
              {disconnecting ? '...' : t('disconnectCalendar')}
            </button>
          ) : (
            <a
              href="/api/auth/google"
              className="text-xs px-4 py-1.5 rounded-md font-medium transition-opacity hover:opacity-90"
              style={{ background: '#57bb8A', color: '#0F0F0F' }}
            >
              {t('connectCalendar')}
            </a>
          )
        )}
      </div>

      {/* Success / error banner from OAuth redirect */}
      {searchParams.get('google') === 'connected' && (
        <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#57bb8A18', color: '#57bb8A', border: '1px solid #57bb8A33' }}>
          Google Calendar connected successfully.
        </p>
      )}
      {searchParams.get('google') === 'error' && (
        <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#E67C7318', color: '#E67C73', border: '1px solid #E67C7333' }}>
          Connection failed. Make sure your Google credentials are configured and try again.
        </p>
      )}

      {/* Info */}
      {!connected && !loading && (
        <p className="text-xs" style={{ color: '#555555' }}>
          {t('calendarDescription')}
        </p>
      )}
    </div>
  )
}
