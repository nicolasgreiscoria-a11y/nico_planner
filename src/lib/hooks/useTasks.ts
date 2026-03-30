'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskType = 'event' | 'project' | 'deadline' | 'other'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  task_type: TaskType
  priority: TaskPriority
  status: TaskStatus
  start_date: string | null   // "yyyy-MM-dd"
  end_date: string | null     // "yyyy-MM-dd"
  on_calendar: boolean
  calendar_event_id: string | null
}

export type TaskDraft = Omit<Task, 'id' | 'user_id' | 'calendar_event_id'>

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
}

export function useTasks() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('end_date', { ascending: true, nullsFirst: false })
    if (data) setTasks(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (draft: TaskDraft): Promise<Task | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
      .from('tasks')
      .insert({ ...draft, user_id: user.id, calendar_event_id: null })
      .select()
      .single()
    if (data) setTasks(prev => [data, ...prev])
    return data ?? null
  }, [supabase])

  const update = useCallback(async (id: string, changes: Partial<TaskDraft>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))
    await supabase.from('tasks').update(changes).eq('id', id)
  }, [supabase])

  const cycleStatus = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const next = STATUS_CYCLE[task.status]
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next } : t))
    await supabase.from('tasks').update({ status: next }).eq('id', id)
  }, [supabase, tasks])

  const remove = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }, [supabase])

  return { tasks, loading, add, update, cycleStatus, remove }
}
