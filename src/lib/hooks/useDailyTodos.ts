'use client'

import { useCallback, useEffect, useState } from 'react'
import { format, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

export type Priority = 'low' | 'medium' | 'high'

export interface DailyTodo {
  id: string
  user_id: string
  todo_date: string    // "yyyy-MM-dd"
  title: string
  priority: Priority
  category_id: string | null
  completed: boolean
}

export function useDailyTodos(weekStart: Date) {
  const supabase = createClient()
  const [todos, setTodos] = useState<DailyTodo[]>([])
  const [loading, setLoading] = useState(true)

  const weekStartStr = format(weekStart, 'yyyy-MM-dd')
  const weekEndStr = format(addDays(weekStart, 6), 'yyyy-MM-dd')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('daily_todos')
      .select('*')
      .gte('todo_date', weekStartStr)
      .lte('todo_date', weekEndStr)
      .order('todo_date', { ascending: true })
    if (data) setTodos(data)
    setLoading(false)
  }, [supabase, weekStartStr, weekEndStr])

  useEffect(() => { load() }, [load])

  const forDate = useCallback((date: string) =>
    todos.filter(t => t.todo_date === date),
    [todos]
  )

  const add = useCallback(async (date: string, title: string, priority: Priority = 'medium') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const optimistic: DailyTodo = {
      id: crypto.randomUUID(),
      user_id: user.id,
      todo_date: date,
      title,
      priority,
      category_id: null,
      completed: false,
    }
    setTodos(prev => [...prev, optimistic])
    const { data } = await supabase
      .from('daily_todos')
      .insert({ user_id: user.id, todo_date: date, title, priority, completed: false })
      .select()
      .single()
    if (data) setTodos(prev => prev.map(t => t.id === optimistic.id ? data : t))
  }, [supabase])

  const toggle = useCallback(async (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    const todo = todos.find(t => t.id === id)
    if (todo) await supabase.from('daily_todos').update({ completed: !todo.completed }).eq('id', id)
  }, [supabase, todos])

  const updatePriority = useCallback(async (id: string, priority: Priority) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, priority } : t))
    await supabase.from('daily_todos').update({ priority }).eq('id', id)
  }, [supabase])

  const remove = useCallback(async (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
    await supabase.from('daily_todos').delete().eq('id', id)
  }, [supabase])

  return { todos, loading, forDate, add, toggle, updatePriority, remove }
}
