import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCalendarClient } from '@/lib/google/calendar'

const TIMEZONE = 'America/Argentina/Buenos_Aires'

// Returns the ISO date string of the next occurrence of dayOfWeek (0=Mon, 6=Sun)
function nextOccurrence(dayOfWeek: number): string {
  const today = new Date()
  const todayDow = (today.getDay() + 6) % 7 // JS getDay: 0=Sun -> convert to 0=Mon
  const diff = (dayOfWeek - todayDow + 7) % 7
  const target = new Date(today)
  target.setDate(today.getDate() + (diff === 0 ? 0 : diff))
  return target.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { entry_id } = await req.json()
  if (!entry_id) return NextResponse.json({ error: 'entry_id required' }, { status: 400 })

  const { data: entry, error: entryErr } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('id', entry_id)
    .eq('user_id', user.id)
    .single()

  if (entryErr || !entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('google_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profile?.google_refresh_token) {
    return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 })
  }

  const calendar = getCalendarClient(profile.google_refresh_token)

  const date = entry.effective_date ?? nextOccurrence(entry.day_of_week)
  // Postgres TIME comes as "HH:MM:SS" — strip seconds before building ISO datetime
  const startTime = entry.start_time.slice(0, 5)
  const endTime = entry.end_time.slice(0, 5)

  const eventBody = {
    summary: entry.title ?? 'Schedule block',
    start: { dateTime: `${date}T${startTime}:00`, timeZone: TIMEZONE },
    end: { dateTime: `${date}T${endTime}:00`, timeZone: TIMEZONE },
  }

  let calendarEventId: string

  try {
    if (entry.calendar_event_id) {
      const res = await calendar.events.update({
        calendarId: 'primary',
        eventId: entry.calendar_event_id,
        requestBody: eventBody,
      })
      calendarEventId = res.data.id!
    } else {
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

  await supabase
    .from('schedule_entries')
    .update({ calendar_event_id: calendarEventId })
    .eq('id', entry_id)

  return NextResponse.json({ success: true, calendar_event_id: calendarEventId })
}
