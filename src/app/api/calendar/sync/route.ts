import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCalendarClient } from '@/lib/google/calendar'

const TIMEZONE = 'America/Argentina/Buenos_Aires'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { task_id } = await req.json()
  if (!task_id) return NextResponse.json({ error: 'task_id required' }, { status: 400 })

  // Fetch task (scoped to user)
  const { data: task, error: taskErr } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', task_id)
    .eq('user_id', user.id)
    .single()

  if (taskErr || !task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  // Fetch refresh token (never exposed to client)
  const { data: profile } = await supabase
    .from('profiles')
    .select('google_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profile?.google_refresh_token) {
    return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 })
  }

  const calendar = getCalendarClient(profile.google_refresh_token)

  // Use start_date or end_date; fall back to today for all-day events
  const today = new Date().toISOString().split('T')[0]
  const startDate = task.start_date ?? task.end_date ?? today
  // Google all-day events: end is exclusive, so add 1 day
  const endDateObj = new Date(task.end_date ?? startDate)
  endDateObj.setDate(endDateObj.getDate() + 1)
  const endDate = endDateObj.toISOString().split('T')[0]

  const eventBody = {
    summary: task.title,
    ...(task.description ? { description: task.description } : {}),
    start: { date: startDate, timeZone: TIMEZONE },
    end: { date: endDate, timeZone: TIMEZONE },
  }

  let calendarEventId: string

  try {
    if (task.calendar_event_id) {
      // Update existing event
      const res = await calendar.events.update({
        calendarId: 'primary',
        eventId: task.calendar_event_id,
        requestBody: eventBody,
      })
      calendarEventId = res.data.id!
    } else {
      // Create new event
      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventBody,
      })
      calendarEventId = res.data.id!
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Calendar API error'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Persist calendar_event_id
  await supabase
    .from('tasks')
    .update({ calendar_event_id: calendarEventId })
    .eq('id', task_id)

  return NextResponse.json({ success: true, calendar_event_id: calendarEventId })
}
