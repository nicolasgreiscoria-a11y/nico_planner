'use client'

import { useState } from 'react'
import { useWeek } from '@/lib/context/WeekContext'
import { useWeeklyTasks } from '@/lib/hooks/useWeeklyTasks'

function WeeklyTaskItem({
  id,
  title,
  completed,
  onToggle,
  onRemove,
}: {
  id: string
  title: string
  completed: boolean
  onToggle: () => void
  onRemove: () => void
}) {
  return (
    <li className="flex items-center gap-3 py-2 px-3 rounded-lg group hover:bg-[#1E1E1E] transition-colors">
      <button
        onClick={onToggle}
        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          background: completed ? '#57bb8A' : 'transparent',
          border: `2px solid ${completed ? '#57bb8A' : '#333333'}`,
        }}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="#0F0F0F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <span
        className="flex-1 text-sm"
        style={{
          color: completed ? '#555555' : '#E8E8E8',
          textDecoration: completed ? 'line-through' : 'none',
        }}
      >
        {title}
      </span>

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#2A2A2A]"
        style={{ color: '#555555' }}
        title="Remove from template"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 2l8 8M10 2L2 10" />
        </svg>
      </button>
    </li>
  )
}

function AddTaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="flex items-center gap-2 px-3 pt-2 mt-1" style={{ borderTop: '1px solid #222222' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
        placeholder="Add weekly task..."
        className="flex-1 bg-transparent text-sm outline-none placeholder-[#444444]"
        style={{ color: '#E8E8E8' }}
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="text-xs px-2.5 py-1 rounded-md font-medium transition-opacity disabled:opacity-40 shrink-0"
        style={{ background: '#57bb8A', color: '#0F0F0F' }}
      >
        Add
      </button>
    </div>
  )
}

export function WeeklyTaskList() {
  const { weekStart } = useWeek()
  const { tasks, loading, toggle, addTask, removeTask, isCompleted, completedCount } = useWeeklyTasks(weekStart)

  if (loading) {
    return (
      <div className="rounded-xl p-4" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
        <p className="text-sm" style={{ color: '#888888' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #2A2A2A' }}>
        <h2
          className="text-sm font-semibold"
          style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
        >
          Weekly Tasks
        </h2>
        {tasks.length > 0 && (
          <span className="text-xs" style={{ color: '#888888' }}>
            {completedCount}/{tasks.length} done
          </span>
        )}
      </div>

      {/* Task list */}
      <div className="px-1 py-2">
        {tasks.length === 0 ? (
          <p className="text-sm px-3 py-2" style={{ color: '#555555' }}>
            No tasks yet. Add one below.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {tasks.map(task => (
              <WeeklyTaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={isCompleted(task.id)}
                onToggle={() => toggle(task.id)}
                onRemove={() => removeTask(task.id)}
              />
            ))}
          </ul>
        )}
        <AddTaskInput onAdd={addTask} />
      </div>
    </div>
  )
}
