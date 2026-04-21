'use client'

import { useWeek } from '@/lib/context/WeekContext'
import { useTranslations } from 'next-intl'

export function WeekNavigator() {
  const { weekLabel, goToPrevWeek, goToNextWeek, goToToday } = useWeek()
  const t = useTranslations('weekNavigator')

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goToPrevWeek}
        className="p-1.5 rounded-md transition-colors hover:bg-[#2A2A2A]"
        aria-label={t('previousWeek')}
        style={{ color: '#888888' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <span
        className="text-sm font-medium min-w-[160px] text-center"
        style={{ color: '#E8E8E8', fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        {weekLabel}
      </span>

      <button
        onClick={goToNextWeek}
        className="p-1.5 rounded-md transition-colors hover:bg-[#2A2A2A]"
        aria-label={t('nextWeek')}
        style={{ color: '#888888' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={goToToday}
        className="ml-1 px-3 py-1 rounded-md text-xs font-medium transition-colors hover:bg-[#2A2A2A]"
        style={{ color: '#57bb8A', border: '1px solid #57bb8A33' }}
      >
        {t('thisWeek')}
      </button>
    </div>
  )
}
