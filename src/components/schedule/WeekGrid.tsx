'use client'

import { useState } from 'react'
import { addDays, format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useWeek } from '@/lib/context/WeekContext'
import { useSchedule, ScheduleEntry } from '@/lib/hooks/useSchedule'
import { useCategories, Category } from '@/lib/hooks/useCategories'
import { useProfile } from '@/lib/hooks/useProfile'
import { SlotEditor } from './SlotEditor'

// ─── Constants ───────────────────────────────────────────────────────────────

const SLOT_HEIGHT = 28        // px per 30-min slot
const TIME_COL_W = 56         // px
const DAY_COL_MIN_W = 120     // px

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlots(dayStart: string): string[] {
  const [sh, sm] = dayStart.split(':').map(Number)
  const startMinutes = sh * 60 + sm
  const endMinutes = 23 * 60 + 30
  const slots: string[] = []
  for (let m = startMinutes; m <= endMinutes; m += 30) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const min = (m % 60).toString().padStart(2, '0')
    slots.push(`${h}:${min}`)
  }
  return slots
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTop(minutes: number, dayStartMinutes: number): number {
  return ((minutes - dayStartMinutes) / 30) * SLOT_HEIGHT
}

function slotToTime(slotIndex: number, dayStart: string): string {
  const [sh, sm] = dayStart.split(':').map(Number)
  const totalMinutes = sh * 60 + sm + slotIndex * 30
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0')
  const min = (totalMinutes % 60).toString().padStart(2, '0')
  return `${h}:${min}`
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

// ─── Entry block ─────────────────────────────────────────────────────────────

function EntryBlock({
  entry,
  category,
  dayStartMinutes,
  onClick,
}: {
  entry: ScheduleEntry
  category: Category | undefined
  dayStartMinutes: number
  onClick: () => void
}) {
  const startMin = timeToMinutes(entry.start_time)
  const endMin = timeToMinutes(entry.end_time)
  const top = minutesToTop(startMin, dayStartMinutes)
  const height = Math.max(((endMin - startMin) / 30) * SLOT_HEIGHT - 2, SLOT_HEIGHT - 2)
  const color = category?.color ?? '#888888'

  return (
    <div
      onClick={e => { e.stopPropagation(); onClick() }}
      className="absolute left-0.5 right-0.5 rounded-md overflow-hidden cursor-pointer transition-opacity hover:opacity-90 select-none"
      style={{
        top,
        height,
        background: color + '33',
        border: `1px solid ${color}66`,
        zIndex: 2,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
        style={{ background: color }}
      />
      <div className="pl-2 pr-1 pt-0.5 overflow-hidden h-full">
        {entry.title && (
          <p
            className="text-xs font-medium leading-tight truncate"
            style={{ color }}
          >
            {entry.title}
          </p>
        )}
        {!entry.title && category && (
          <p className="text-xs leading-tight truncate" style={{ color: color + 'aa' }}>
            {category.name}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Day column ───────────────────────────────────────────────────────────────

function DayColumn({
  dayIndex,
  dayName,
  date,
  slots,
  entries,
  categories,
  dayStartMinutes,
  onSlotClick,
  onEntryClick,
}: {
  dayIndex: number
  dayName: string
  date: Date
  slots: string[]
  entries: ScheduleEntry[]
  categories: Category[]
  dayStartMinutes: number
  onSlotClick: (dayIndex: number, slotTime: string) => void
  onEntryClick: (entry: ScheduleEntry) => void
}) {
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  const dayEntries = entries.filter(e => e.day_of_week === dayIndex)
  const totalHeight = slots.length * SLOT_HEIGHT

  return (
    <div className="flex flex-col" style={{ minWidth: DAY_COL_MIN_W, flex: 1 }}>
      {/* Day header */}
      <div
        className="text-center py-2.5 shrink-0"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--glass-border)',
          borderLeft: '1px solid var(--glass-border)',
        }}
      >
        <div
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: '#888888' }}
        >
          {dayName}
        </div>
        <div
          className="text-sm font-semibold mt-0.5"
          style={{
            color: isToday ? '#57bb8A' : '#E8E8E8',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {format(date, 'd')}
        </div>
      </div>

      {/* Slot area */}
      <div
        className="relative"
        style={{
          height: totalHeight,
          borderLeft: '1px solid #2A2A2A',
        }}
      >
        {/* Background grid lines + click zones */}
        {slots.map((slotTime, si) => (
          <div
            key={si}
            className="absolute left-0 right-0 cursor-pointer hover:bg-[#57bb8A08] transition-colors"
            style={{
              top: si * SLOT_HEIGHT,
              height: SLOT_HEIGHT,
              borderBottom: '1px solid #1E1E1E',
            }}
            onClick={() => onSlotClick(dayIndex, slotTime)}
          />
        ))}

        {/* Entry blocks */}
        {dayEntries.map(entry => {
          const cat = categories.find(c => c.id === entry.category_id)
          return (
            <EntryBlock
              key={entry.id}
              entry={entry}
              category={cat}
              dayStartMinutes={dayStartMinutes}
              onClick={() => onEntryClick(entry)}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Editor state ─────────────────────────────────────────────────────────────

interface CreateState {
  mode: 'create'
  dayIndex: number
  startTime: string
  endTime: string
}

interface EditState {
  mode: 'edit'
  entry: ScheduleEntry
}

type EditorState = CreateState | EditState | null

// ─── Main WeekGrid ────────────────────────────────────────────────────────────

export function WeekGrid() {
  const t = useTranslations('schedule')
  const tc = useTranslations('common')
  const { weekStart } = useWeek()
  const { entries, loading, add, update, remove, syncToCalendar } = useSchedule(weekStart)
  const { categories } = useCategories()
  const { profile } = useProfile()
  const [editorState, setEditorState] = useState<EditorState>(null)

  const DAY_NAMES = DAY_KEYS.map(k => t(`days.${k}`))

  const DAY_START = profile?.day_start_time ?? '05:00'
  const slots = generateSlots(DAY_START)
  const dayStartMinutes = timeToMinutes(DAY_START)

  function handleSlotClick(dayIndex: number, slotTime: string) {
    const [sh, sm] = slotTime.split(':').map(Number)
    const endMinutes = sh * 60 + sm + 60
    const endH = Math.floor(endMinutes / 60).toString().padStart(2, '0')
    const endM = (endMinutes % 60).toString().padStart(2, '0')
    setEditorState({
      mode: 'create',
      dayIndex,
      startTime: slotTime,
      endTime: `${endH}:${endM}`,
    })
  }

  async function handleSave(data: {
    title: string | null
    categoryId: string | null
    startTime: string
    endTime: string
    isRecurring: boolean
  }) {
    if (!editorState) return
    if (editorState.mode === 'create') {
      await add(
        editorState.dayIndex,
        data.startTime,
        data.endTime,
        data.categoryId,
        data.title,
        data.isRecurring,
      )
    } else {
      await update(editorState.entry.id, {
        start_time: data.startTime,
        end_time: data.endTime,
        category_id: data.categoryId,
        title: data.title,
      })
    }
    setEditorState(null)
  }

  async function handleDelete() {
    if (!editorState || editorState.mode !== 'edit') return
    await remove(editorState.entry.id)
    setEditorState(null)
  }

  const editorDayLabel = editorState
    ? editorState.mode === 'create'
      ? `${DAY_NAMES[editorState.dayIndex]} ${format(addDays(weekStart, editorState.dayIndex), 'd')}`
      : `${DAY_NAMES[editorState.entry.day_of_week]} ${format(addDays(weekStart, editorState.entry.day_of_week), 'd')}`
    : ''

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
      {/* Scroll container */}
      <div className="flex overflow-auto flex-1" style={{ background: 'var(--bg)' }}>
        {/* Time column */}
        <div
          className="shrink-0 sticky left-0 z-10"
          style={{ width: TIME_COL_W, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', borderRight: '1px solid var(--glass-border)' }}
        >
          {/* Spacer matching day header height */}
          <div
            className="shrink-0"
            style={{ height: 56, borderBottom: '1px solid var(--glass-border)', background: 'transparent' }}
          />
          {/* Time labels */}
          {slots.map((slot, si) => (
            <div
              key={si}
              className="flex items-start justify-end pr-2"
              style={{ height: SLOT_HEIGHT }}
            >
              {slot.endsWith(':00') && (
                <span
                  className="text-[10px] leading-none -mt-1.5"
                  style={{ color: '#555555', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {format(new Date(`2000-01-01T${slot}`), 'h a')}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex flex-1" style={{ minWidth: DAY_COL_MIN_W * 7 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <DayColumn
              key={i}
              dayIndex={i}
              dayName={DAY_NAMES[i]}
              date={addDays(weekStart, i)}
              slots={slots}
              entries={entries}
              categories={categories}
              dayStartMinutes={dayStartMinutes}
              onSlotClick={handleSlotClick}
              onEntryClick={entry => setEditorState({ mode: 'edit', entry })}
            />
          ))}
        </div>
      </div>

      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ background: '#0F0F0F88' }}
        >
          <span className="text-sm" style={{ color: '#888888' }}>{tc('loading')}</span>
        </div>
      )}

      {/* Slot editor modal */}
      {editorState && (
        <SlotEditor
          mode={editorState.mode}
          initialTitle={editorState.mode === 'edit' ? editorState.entry.title : null}
          initialCategoryId={editorState.mode === 'edit' ? editorState.entry.category_id : null}
          initialStartTime={editorState.mode === 'create' ? editorState.startTime : editorState.entry.start_time}
          initialEndTime={editorState.mode === 'create' ? editorState.endTime : editorState.entry.end_time}
          dayLabel={editorDayLabel}
          categories={categories}
          calendarConnected={profile?.google_calendar_connected ?? false}
          isSynced={editorState.mode === 'edit' ? !!editorState.entry.calendar_event_id : false}
          onSave={handleSave}
          onSyncToCalendar={
            editorState.mode === 'edit'
              ? () => syncToCalendar(editorState.entry.id)
              : undefined
          }
          onDelete={editorState.mode === 'edit' ? handleDelete : undefined}
          onClose={() => setEditorState(null)}
        />
      )}
    </div>
  )
}
