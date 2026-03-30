'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useWeek } from '@/lib/context/WeekContext'
import { useHabits } from '@/lib/hooks/useHabits'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_FULL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Checkbox circle ─────────────────────────────────────────────────────────

function HabitCheck({
  completed,
  onClick,
}: {
  completed: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 mx-auto"
      style={{
        background: completed ? '#57bb8A' : 'transparent',
        border: `2px solid ${completed ? '#57bb8A' : '#333333'}`,
      }}
      aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
    >
      {completed && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="#0F0F0F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

// ─── Completion bar ───────────────────────────────────────────────────────────

function CompletionBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? '#57bb8A' : pct >= 50 ? '#F6BF26' : '#E67C73'
  return (
    <div className="flex items-center gap-2 justify-end">
      <div
        className="w-14 h-1.5 rounded-full overflow-hidden"
        style={{ background: '#2A2A2A' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs w-8 text-right" style={{ color }}>
        {pct}%
      </span>
    </div>
  )
}

// ─── Add habit form ───────────────────────────────────────────────────────────

function AddHabitForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid #2A2A2A' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
        placeholder="Add a new habit..."
        className="flex-1 bg-transparent text-sm outline-none placeholder-[#444444]"
        style={{ color: '#E8E8E8' }}
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="text-xs px-3 py-1.5 rounded-md font-medium transition-opacity disabled:opacity-40"
        style={{ background: '#57bb8A', color: '#0F0F0F' }}
      >
        Add
      </button>
    </div>
  )
}

// ─── Main table ───────────────────────────────────────────────────────────────

export function HabitTable() {
  const { weekStart } = useWeek()
  const { habits, loading, weekDates, toggle, addHabit, removeHabit, isCompleted, weekCompletion } = useHabits(weekStart)

  const today = format(new Date(), 'yyyy-MM-dd')

  if (loading) {
    return (
      <div className="rounded-xl p-6" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
        <p className="text-sm" style={{ color: '#888888' }}>Loading habits...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
              <th
                className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide"
                style={{ color: '#888888', width: '40%' }}
              >
                Habit
              </th>
              {weekDates.map((date, i) => (
                <th
                  key={date}
                  className="text-center px-1 py-3 text-xs font-medium"
                  style={{
                    color: date === today ? '#57bb8A' : '#888888',
                    width: 36,
                  }}
                >
                  <div className="uppercase tracking-wide">{DAY_LABELS[i]}</div>
                  <div
                    className="text-[10px] font-normal mt-0.5"
                    style={{ color: date === today ? '#57bb8A' : '#555555' }}
                  >
                    {format(new Date(date + 'T12:00:00'), 'd')}
                  </div>
                </th>
              ))}
              <th
                className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wide"
                style={{ color: '#888888' }}
              >
                Week
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-sm"
                  style={{ color: '#555555' }}
                >
                  No habits yet. Add one below.
                </td>
              </tr>
            )}
            {habits.map((habit, hi) => (
              <tr
                key={habit.id}
                className="group transition-colors hover:bg-[#1E1E1E]"
                style={{ borderTop: hi > 0 ? '1px solid #222222' : undefined }}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: '#E8E8E8' }}>
                      {habit.name}
                    </span>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                      style={{ color: '#555555' }}
                      title="Remove habit"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 2l8 8M10 2L2 10" />
                      </svg>
                    </button>
                  </div>
                </td>
                {weekDates.map(date => (
                  <td key={date} className="px-1 py-2 text-center">
                    <HabitCheck
                      completed={isCompleted(habit.id, date)}
                      onClick={() => toggle(habit.id, date)}
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <CompletionBar pct={weekCompletion(habit.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddHabitForm onAdd={addHabit} />
    </div>
  )
}
