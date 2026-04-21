'use client'

import { useCallback, useEffect, useState } from 'react'
import { format, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

export interface ScheduleEntry {
  id: string
  user_id: string
  day_of_week: number   // 0=Mon, 6=Sun
  start_time: string    // "HH:MM" normalized
  end_time: string      // "HH:MM" normalized
  category_id: string | null
  title: string | null
  is_recurring: boolean
  effective_date: string | null
  calendar_event_id: string | null
}

function normalizeTime(t: string): string {
  // Postgres TIME may come as "HH:MM:SS" — strip seconds
  return t.slice(0, 5)
}

export function useSchedule(weekStart: Date) {
  const supabase = createClient()
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  const weekEnd = addDays(weekStart, 6)
  const weekStartStr = format(weekStart, 'yyyy-MM-dd')
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('schedule_entries')
      .select('*')
      .or(
        `is_recurring.eq.true,and(effective_date.gte.${weekStartStr},effective_date.lte.${weekEndStr})`
      )
      .order('start_time', { ascending: true })

    if (data) {
      setEntries(
        data.map(e => ({
          ...e,
          start_time: normalizeTime(e.start_time),
          end_time: normalizeTime(e.end_time),
        }))
      )
    }
    setLoading(false)
  }, [supabase, weekStartStr, weekEndStr])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    categoryId: string | null,
    title: string | null,
    isRecurring = true,
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const effectiveDate = isRecurring
      ? null
      : format(addDays(weekStart, dayOfWeek), 'yyyy-MM-dd')

    const { data } = await supabase
      .from('schedule_entries')
      .insert({
        user_id: user.id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        category_id: categoryId,
        title,
        is_recurring: isRecurring,
        effective_date: effectiveDate,
      })
      .select()
      .single()

    if (data) {
      setEntries(prev => [
        ...prev,
        { ...data, start_time: normalizeTime(data.start_time), end_time: normalizeTime(data.end_time) },
      ])
    }
  }, [supabase, weekStart])

  const update = useCallback(async (
    id: string,
    changes: Partial<Pick<ScheduleEntry, 'start_time' | 'end_time' | 'category_id' | 'title'>>,
  ) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e))
    await supabase.from('schedule_entries').update(changes).eq('id', id)
  }, [supabase])

  const remove = useCallback(async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    await supabase.from('schedule_entries').delete().eq('id', id)
  }, [supabase])

  const syncToCalendar = useCallback(async (entryId: string) => {
    const res = await fetch('/api/calendar/sync_block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_id: entryId }),
    })
    const json = await res.json()
    if (json.calendar_event_id) {
      setEntries(prev =>
        prev.map(e => e.id === entryId ? { ...e, calendar_event_id: json.calendar_event_id } : e)
      )
    }
    if (!res.ok) throw new Error(json.error ?? 'Sync failed')
  }, [])

  return { entries, loading, add, update, remove, syncToCalendar }
}
