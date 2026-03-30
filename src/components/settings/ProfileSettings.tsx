'use client'

import { useEffect, useState } from 'react'
import { useProfile } from '@/lib/hooks/useProfile'

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

const WEEK_DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
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
  background: '#1A1A1A',
  border: '1px solid #2A2A2A',
  color: '#E8E8E8',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}

export function ProfileSettings() {
  const { profile, loading, saving, save } = useProfile()

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
    return <p className="text-sm" style={{ color: '#888888' }}>Loading profile...</p>
  }

  return (
    <div className="space-y-5">
      <Field label="Display name">
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your name"
          style={inputStyle}
        />
      </Field>

      <Field label="Timezone">
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

      <Field label="Week starts on">
        <select
          value={weekStartDay}
          onChange={e => setWeekStartDay(Number(e.target.value))}
          style={inputStyle}
        >
          {WEEK_DAYS.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Day starts at">
        <select
          value={dayStartTime}
          onChange={e => setDayStartTime(e.target.value)}
          style={inputStyle}
        >
          {START_TIMES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
        style={{ background: '#57bb8A', color: '#0F0F0F' }}
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  )
}
