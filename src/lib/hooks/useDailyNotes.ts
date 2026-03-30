'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { format, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

export interface DailyNote {
  id: string
  user_id: string
  note_date: string    // "yyyy-MM-dd"
  content: string
}

export function useDailyNotes(weekStart: Date) {
  const supabase = createClient()
  const [notes, setNotes] = useState<Record<string, string>>({})  // date -> content
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const weekStartStr = format(weekStart, 'yyyy-MM-dd')
  const weekEndStr = format(addDays(weekStart, 6), 'yyyy-MM-dd')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('daily_notes')
        .select('*')
        .gte('note_date', weekStartStr)
        .lte('note_date', weekEndStr)
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((n: DailyNote) => { map[n.note_date] = n.content })
        setNotes(map)
      }
    }
    load()
  }, [supabase, weekStartStr, weekEndStr])

  const getNote = useCallback((date: string): string => notes[date] ?? '', [notes])

  const saveNote = useCallback(async (date: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(prev => ({ ...prev, [date]: true }))
    await supabase
      .from('daily_notes')
      .upsert({ user_id: user.id, note_date: date, content }, { onConflict: 'user_id,note_date' })
    setSaving(prev => ({ ...prev, [date]: false }))
  }, [supabase])

  // Debounced update: update local state immediately, persist after 2s idle
  const updateNote = useCallback((date: string, content: string) => {
    setNotes(prev => ({ ...prev, [date]: content }))
    if (debounceRef.current[date]) clearTimeout(debounceRef.current[date])
    debounceRef.current[date] = setTimeout(() => saveNote(date, content), 2000)
  }, [saveNote])

  const flushNote = useCallback((date: string) => {
    if (debounceRef.current[date]) {
      clearTimeout(debounceRef.current[date])
      delete debounceRef.current[date]
      saveNote(date, notes[date] ?? '')
    }
  }, [saveNote, notes])

  const isSaving = useCallback((date: string) => saving[date] ?? false, [saving])

  return { getNote, updateNote, flushNote, isSaving }
}
