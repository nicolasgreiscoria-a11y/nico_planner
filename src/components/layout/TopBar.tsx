'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { WeekNavigator } from './WeekNavigator'

export function TopBar({ displayName }: { displayName: string }) {
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('topBar')

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  return (
    <header
      className="flex items-center justify-between px-5 py-3 shrink-0"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
        height: 56,
      }}
    >
      {/* Greeting */}
      <div className="hidden md:block">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text)', fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          {t('greeting', { name: displayName })}
        </span>
      </div>

      {/* Week navigator — centered */}
      <div className="flex-1 flex justify-center md:justify-center">
        <WeekNavigator />
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
        style={{
          color: 'var(--muted)',
          fontFamily: 'IBM Plex Sans, sans-serif',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--glass-surface)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
        }}
      >
        {t('signOut')}
      </button>
    </header>
  )
}
