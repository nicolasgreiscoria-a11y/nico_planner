import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCalendarClient } from '@/lib/google/calendar'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { task_id } = await req.json()
  if (!task_id) return NextResponse.json({ error: 'task_id required' }, { status: 400 })

  const { data: task } = await supabase
    .from('tasks')
    .select('calendar_event_id')
    .eq('id', task_id)
    .eq('user_id', user.id)
    .single()

  // Nothing to delete if no event is linked
  if (!task?.calendar_event_id) {
    return NextResponse.json({ success: true })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('google_refresh_token')
    .eq('id', user.id)
    .single()

  if (profile?.google_refresh_token) {
    const calendar = getCalendarClient(profile.google_refresh_token)
    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: task.calendar_event_id,
      })
    } catch {
      // Event may already be deleted on Google's side — safe to ignore
    }
  }

  await supabase
    .from('tasks')
    .update({ calendar_event_id: null, on_calendar: false })
    .eq('id', task_id)

  return NextResponse.json({ success: true })
}
