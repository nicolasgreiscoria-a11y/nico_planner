'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useWeek } from '@/lib/context/WeekContext'
import { useDailyTodos } from '@/lib/hooks/useDailyTodos'
import { useDailyNotes } from '@/lib/hooks/useDailyNotes'
import { DailyTodoList } from './DailyTodoList'
import { DailyNotes } from './DailyNotes'

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

function DayPanel({
  dayIndex,
  date,
  todosHook,
  notesHook,
}: {
  dayIndex: number
  date: Date
  todosHook: ReturnType<typeof useDailyTodos>
  notesHook: ReturnType<typeof useDailyNotes>
}) {
  const t = useTranslations('schedule')
  const [open, setOpen] = useState(false)
  const dateStr = format(date, 'yyyy-MM-dd')
  const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')
  const todoCount = todosHook.forDate(dateStr).length
  const completedCount = todosHook.forDate(dateStr).filter(t => t.completed).length
  const hasNote = notesHook.getNote(dateStr).trim().length > 0

  return (
    <div
      className="flex-1 rounded-lg overflow-hidden transition-all"
      style={{
        background: 'var(--glass-surface)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${open ? 'var(--glass-border-strong)' : 'var(--glass-border)'}`,
        minWidth: 120,
      }}
    >
      {/* Panel header / toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#1E1E1E] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold"
            style={{ color: isToday ? '#57bb8A' : '#888888', fontFamily: 'DM Sans, sans-serif' }}
          >
            {t(`days.${DAY_KEYS[dayIndex]}`)}
          </span>
          <span className="text-xs" style={{ color: '#444444' }}>
            {format(date, 'd')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {todoCount > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: '#57bb8A22', color: '#57bb8A' }}
            >
              {completedCount}/{todoCount}
            </span>
          )}
          {hasNote && (
            <span style={{ color: '#555555' }} title="Has notes">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <rect x="1" y="1" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 4h4M3 6h2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
          )}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: '#444444',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s',
            }}
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div
          className="px-3 pb-3 space-y-3"
          style={{ borderTop: '1px solid #222222' }}
        >
          <div className="pt-2">
            <DailyTodoList date={dateStr} todosHook={todosHook} />
          </div>
          <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: 8 }}>
            <DailyNotes
              date={dateStr}
              content={notesHook.getNote(dateStr)}
              saving={notesHook.isSaving(dateStr)}
              onChange={content => notesHook.updateNote(dateStr, content)}
              onBlur={() => notesHook.flushNote(dateStr)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function DailyPanels() {
  const { weekStart } = useWeek()
  const todosHook = useDailyTodos(weekStart)
  const notesHook = useDailyNotes(weekStart)

  return (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
      {Array.from({ length: 7 }, (_, i) => (
        <DayPanel
          key={i}
          dayIndex={i}
          date={addDays(weekStart, i)}
          todosHook={todosHook}
          notesHook={notesHook}
        />
      ))}
    </div>
  )
}
