'use client'

import { useEffect, useState } from 'react'
import { useProfile } from '@/lib/hooks/useProfile'
import { useTranslations } from 'next-intl'
import { setLocale } from '@/lib/actions/locale'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/i18n/request'

const TIMEZONES = [
  'America/Argentina/Buenos_Aires',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'UTC',
]


const START_TIMES = [
  '04:00', '05:00', '06:00', '07:00', '08:00',
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide" style={{ color: '#888888' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'rgba(0,0,0,0.25)',
  border: '1px solid var(--glass-border)',
  color: 'var(--text)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  backdropFilter: 'blur(4px)',
}

export function ProfileSettings() {
  const { profile, loading, saving, save } = useProfile()
  const t = useTranslations('settings')
  const router = useRouter()

  async function handleLocaleChange(locale: Locale) {
    await setLocale(locale)
    router.refresh()
  }

  const [displayName, setDisplayName] = useState('')
  const [timezone, setTimezone] = useState('America/Argentina/Buenos_Aires')
  const [weekStartDay, setWeekStartDay] = useState(1)
  const [dayStartTime, setDayStartTime] = useState('05:00')

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.display_name ?? '')
    setTimezone(profile.timezone ?? 'America/Argentina/Buenos_Aires')
    setWeekStartDay(profile.week_start_day ?? 1)
    setDayStartTime(profile.day_start_time ?? '05:00')
  }, [profile])

  async function handleSave() {
    await save({
      display_name: displayName.trim() || null,
      timezone,
      week_start_day: weekStartDay,
      day_start_time: dayStartTime,
    })
  }

  if (loading) {
    return <p className="text-sm" style={{ color: '#888888' }}>{t('profile')}...</p>
  }

  return (
    <div className="space-y-5">
      <Field label={t('displayName')}>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder={t('displayName')}
          style={inputStyle}
        />
      </Field>

      <Field label={t('timezone')}>
        <select
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          style={inputStyle}
        >
          {TIMEZONES.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </Field>

      <Field label={t('weekStartDay')}>
        <select
          value={weekStartDay}
          onChange={e => setWeekStartDay(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={0}>{t('days.sunday')}</option>
          <option value={1}>{t('days.monday')}</option>
        </select>
      </Field>

      <Field label={t('dayStartTime')}>
        <select
          value={dayStartTime}
          onChange={e => setDayStartTime(e.target.value)}
          style={inputStyle}
        >
          {START_TIMES.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </Field>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
        style={{ background: '#57bb8A', color: '#0F0F0F' }}
      >
        {saving ? t('saved') : t('saveChanges')}
      </button>

      <div className="mt-8 border-t border-[#2A2A2A] pt-6">
        <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-4">
          {t('language')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleLocaleChange('en')}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#57bb8A] text-[#E8E8E8]"
          >
            {t('languages.en')}
          </button>
          <button
            onClick={() => handleLocaleChange('es')}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#57bb8A] text-[#E8E8E8]"
          >
            {t('languages.es')}
          </button>
        </div>
      </div>
    </div>
  )
}
