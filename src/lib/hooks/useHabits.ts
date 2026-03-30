'use client'

import { useCallback, useEffect, useState } from 'react'
import { format, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

export interface Habit {
  id: string
  user_id: string
  name: string
  sort_order: number
  is_active: boolean
}

export interface HabitLog {
  id: string
  habit_id: string
  log_date: string   // "yyyy-MM-dd"
  completed: boolean
}

export function useHabits(weekStart: Date) {
  const supabase = createClient()
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), 'yyyy-MM-dd')
  )

  const load = useCallback(async () => {
    setLoading(true)
    const [habitsRes, logsRes] = await Promise.all([
      supabase
        .from('habits')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('habit_logs')
        .select('*')
        .gte('log_date', weekDates[0])
        .lte('log_date', weekDates[6]),
    ])
    if (habitsRes.data) setHabits(habitsRes.data)
    if (logsRes.data) setLogs(logsRes.data)
    setLoading(false)
  }, [supabase, weekDates[0], weekDates[6]])  // eslint-disable-line

  useEffect(() => { load() }, [load])

  const toggle = useCallback(async (habitId: string, date: string) => {
    const existing = logs.find(l => l.habit_id === habitId && l.log_date === date)

    if (existing) {
      // Optimistic toggle
      setLogs(prev =>
        prev.map(l =>
          l.id === existing.id ? { ...l, completed: !l.completed } : l
        )
      )
      await supabase
        .from('habit_logs')
        .update({ completed: !existing.completed })
        .eq('id', existing.id)
    } else {
      // Optimistic insert
      const optimistic: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        log_date: date,
        completed: true,
      }
      setLogs(prev => [...prev, optimistic])
      const { data } = await supabase
        .from('habit_logs')
        .upsert({ habit_id: habitId, log_date: date, completed: true }, { onConflict: 'habit_id,log_date' })
        .select()
        .single()
      if (data) {
        setLogs(prev => prev.map(l => l.id === optimistic.id ? data : l))
      }
    }
  }, [supabase, logs])

  const addHabit = useCallback(async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const nextOrder = habits.length
    const { data } = await supabase
      .from('habits')
      .insert({ user_id: user.id, name, sort_order: nextOrder, is_active: true })
      .select()
      .single()
    if (data) setHabits(prev => [...prev, data])
  }, [supabase, habits.length])

  const removeHabit = useCallback(async (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    await supabase.from('habits').update({ is_active: false }).eq('id', id)
  }, [supabase])

  const isCompleted = useCallback((habitId: string, date: string): boolean => {
    const log = logs.find(l => l.habit_id === habitId && l.log_date === date)
    return log?.completed ?? false
  }, [logs])

  const weekCompletion = useCallback((habitId: string): number => {
    const done = weekDates.filter(d => isCompleted(habitId, d)).length
    return Math.round((done / 7) * 100)
  }, [weekDates, isCompleted])

  return { habits, logs, loading, weekDates, toggle, addHabit, removeHabit, isCompleted, weekCompletion }
}
