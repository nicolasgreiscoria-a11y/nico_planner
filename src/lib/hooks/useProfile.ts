'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Profile {
  id: string
  display_name: string | null
  timezone: string | null
  week_start_day: number
  day_start_time: string
  google_calendar_connected: boolean
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
      if (data) {
        data.day_start_time = data.day_start_time?.slice(0, 5) ?? '05:00'
        setProfile({
          ...data,
          google_calendar_connected: !!data.google_refresh_token,
        })
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  const save = useCallback(async (changes: Partial<Omit<Profile, 'id'>>) => {
    console.log('save called, profile:', profile)
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', profile.id)
    if (error) {
      console.error('Save failed:', error)
    } else {
      console.log('Saved successfully')
      // Refetch fresh data from DB
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single()
      if (data) {
        data.day_start_time = data.day_start_time?.slice(0, 5) ?? '05:00'
        setProfile({
          ...data,
          google_calendar_connected: !!data.google_refresh_token,
        })
      }
    }
    setSaving(false)
  }, [supabase, profile])

  return { profile, loading, saving, save }
}
