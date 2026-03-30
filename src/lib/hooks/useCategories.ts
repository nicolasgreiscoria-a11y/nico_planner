'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  sort_order: number
}

export function useCategories() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (data) setCategories(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetch() }, [fetch])

  const add = useCallback(async (name: string, color: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const nextOrder = categories.length
    const optimistic: Category = {
      id: crypto.randomUUID(),
      user_id: user.id,
      name,
      color,
      sort_order: nextOrder,
    }
    setCategories(prev => [...prev, optimistic])
    const { data } = await supabase
      .from('categories')
      .insert({ user_id: user.id, name, color, sort_order: nextOrder })
      .select()
      .single()
    if (data) {
      setCategories(prev => prev.map(c => c.id === optimistic.id ? data : c))
    }
  }, [supabase, categories.length])

  const update = useCallback(async (id: string, changes: Partial<Pick<Category, 'name' | 'color'>>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...changes } : c))
    await supabase.from('categories').update(changes).eq('id', id)
  }, [supabase])

  const remove = useCallback(async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    await supabase.from('categories').delete().eq('id', id)
  }, [supabase])

  return { categories, loading, add, update, remove }
}
