'use client'

import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

export interface WeeklyTask {
  id: string
  user_id: string
  title: string
  is_template: boolean
}

export interface WeeklyTaskLog {
  id: string
  weekly_task_id: string
  week_start_date: string  // "yyyy-MM-dd"
  completed: boolean
}

export function useWeeklyTasks(weekStart: Date) {
  const supabase = createClient()
  const [tasks, setTasks] = useState<WeeklyTask[]>([])
  const [logs, setLogs] = useState<WeeklyTaskLog[]>([])
  const [loading, setLoading] = useState(true)

  const weekStartStr = format(weekStart, 'yyyy-MM-dd')

  const load = useCallback(async () => {
    setLoading(true)
    const [tasksRes, logsRes] = await Promise.all([
      supabase
        .from('weekly_tasks')
        .select('*')
        .eq('is_template', true)
        .order('id', { ascending: true }),
      supabase
        .from('weekly_task_logs')
        .select('*')
        .eq('week_start_date', weekStartStr),
    ])
    if (tasksRes.data) setTasks(tasksRes.data)
    if (logsRes.data) setLogs(logsRes.data)
    setLoading(false)
  }, [supabase, weekStartStr])

  useEffect(() => { load() }, [load])

  const toggle = useCallback(async (taskId: string) => {
    const existing = logs.find(l => l.weekly_task_id === taskId && l.week_start_date === weekStartStr)

    if (existing) {
      setLogs(prev =>
        prev.map(l => l.id === existing.id ? { ...l, completed: !l.completed } : l)
      )
      await supabase
        .from('weekly_task_logs')
        .update({ completed: !existing.completed })
        .eq('id', existing.id)
    } else {
      const optimistic: WeeklyTaskLog = {
        id: crypto.randomUUID(),
        weekly_task_id: taskId,
        week_start_date: weekStartStr,
        completed: true,
      }
      setLogs(prev => [...prev, optimistic])
      const { data } = await supabase
        .from('weekly_task_logs')
        .upsert(
          { weekly_task_id: taskId, week_start_date: weekStartStr, completed: true },
          { onConflict: 'weekly_task_id,week_start_date' }
        )
        .select()
        .single()
      if (data) {
        setLogs(prev => prev.map(l => l.id === optimistic.id ? data : l))
      }
    }
  }, [supabase, logs, weekStartStr])

  const addTask = useCallback(async (title: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('weekly_tasks')
      .insert({ user_id: user.id, title, is_template: true })
      .select()
      .single()
    if (data) setTasks(prev => [...prev, data])
  }, [supabase])

  const removeTask = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('weekly_tasks').delete().eq('id', id)
  }, [supabase])

  const isCompleted = useCallback((taskId: string): boolean => {
    const log = logs.find(l => l.weekly_task_id === taskId && l.week_start_date === weekStartStr)
    return log?.completed ?? false
  }, [logs, weekStartStr])

  const completedCount = tasks.filter(t => isCompleted(t.id)).length

  return { tasks, loading, toggle, addTask, removeTask, isCompleted, completedCount }
}
