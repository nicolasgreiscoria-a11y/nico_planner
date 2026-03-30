'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { WeekNavigator } from './WeekNavigator'

export function TopBar({ displayName }: { displayName: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  return (
    <header
      className="flex items-center justify-between px-5 py-3 shrink-0"
      style={{
        background: '#111111',
        borderBottom: '1px solid #2A2A2A',
        height: 56,
      }}
    >
      {/* Greeting */}
      <div className="hidden md:block">
        <span
          className="text-sm font-medium"
          style={{ color: '#E8E8E8', fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          Hey, {displayName}
        </span>
      </div>

      {/* Week navigator — centered */}
      <div className="flex-1 flex justify-center md:justify-center">
        <WeekNavigator />
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-[#2A2A2A]"
        style={{ color: '#888888', fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        Sign out
      </button>
    </header>
  )
}
