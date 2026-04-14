'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Profile {
  id: string
  display_name: string | null
  timezone: string | null
  week_start_day: number
  day_start_time: string
}

export function useProfile() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data)
      setLoading(false)
    }
    load()
  }, [supabase])

  const save = useCallback(async (changes: Partial<Omit<Profile, 'id'>>) => {
    if (!profile) return
    setSaving(true)
    setProfile(prev => prev ? { ...prev, ...changes } : prev)
    const { error } = await supabase.from('profiles').upsert({ id: profile.id, ...changes })
    if (error) console.error('Save failed:', error)
    else console.log('Saved successfully')
    setSaving(false)
  }, [supabase, profile])

  return { profile, loading, saving, save }
}
