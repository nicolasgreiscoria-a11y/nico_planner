'use client'

import { useState } from 'react'
import { DailyTodo, Priority, useDailyTodos } from '@/lib/hooks/useDailyTodos'
import { CategoryBadge } from '@/components/settings/CategoryBadge'
import { useCategories } from '@/lib/hooks/useCategories'

// ─── Priority dot ─────────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<Priority, string> = {
  high: '#E67C73',
  medium: '#F6BF26',
  low: '#57bb8A',
}

const PRIORITY_OPTIONS: Priority[] = ['high', 'medium', 'low']

function PriorityDot({ priority, onChange }: { priority: Priority; onChange: (p: Priority) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
        style={{ background: PRIORITY_COLOR[priority] }}
        title={`Priority: ${priority}`}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-5 z-20 rounded-lg py-1 shadow-xl"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', minWidth: 90 }}
          >
            {PRIORITY_OPTIONS.map(p => (
              <button
                key={p}
                onClick={() => { onChange(p); setOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#2A2A2A] text-left text-xs"
                style={{ color: PRIORITY_COLOR[p] }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[p] }} />
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Todo item ────────────────────────────────────────────────────────────────

function DailyTodoItem({
  todo,
  onToggle,
  onUpdatePriority,
  onRemove,
  categories,
}: {
  todo: DailyTodo
  onToggle: () => void
  onUpdatePriority: (p: Priority) => void
  onRemove: () => void
  categories: ReturnType<typeof useCategories>['categories']
}) {
  const cat = categories.find(c => c.id === todo.category_id)

  return (
    <li className="flex items-start gap-2 py-1.5 group">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-all duration-150"
        style={{
          background: todo.completed ? '#57bb8A' : 'transparent',
          border: `1.5px solid ${todo.completed ? '#57bb8A' : '#333333'}`,
        }}
      >
        {todo.completed && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4l2 2 4-4" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Priority dot */}
      <PriorityDot priority={todo.priority} onChange={onUpdatePriority} />

      {/* Title + category */}
      <div className="flex-1 min-w-0">
        <span
          className="text-xs leading-snug"
          style={{
            color: todo.completed ? '#555555' : '#E8E8E8',
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
        >
          {todo.title}
        </span>
        {cat && (
          <div className="mt-0.5">
            <CategoryBadge name={cat.name} color={cat.color} />
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        style={{ color: '#444444' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 1l8 8M9 1L1 9" />
        </svg>
      </button>
    </li>
  )
}

// ─── Add todo input ───────────────────────────────────────────────────────────

function AddTodoInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')

  function submit() {
    const t = value.trim()
    if (!t) return
    onAdd(t)
    setValue('')
  }

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
        placeholder="Add task..."
        className="flex-1 bg-transparent text-xs outline-none placeholder-[#333333]"
        style={{ color: '#E8E8E8' }}
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="text-[10px] px-2 py-0.5 rounded font-medium disabled:opacity-40"
        style={{ background: '#57bb8A22', color: '#57bb8A', border: '1px solid #57bb8A33' }}
      >
        Add
      </button>
    </div>
  )
}

// ─── Exported list ────────────────────────────────────────────────────────────

export function DailyTodoList({
  date,
  todosHook,
}: {
  date: string
  todosHook: ReturnType<typeof useDailyTodos>
}) {
  const { categories } = useCategories()
  const todos = todosHook.forDate(date)

  return (
    <div className="space-y-1">
      <label
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: '#555555' }}
      >
        To-do
      </label>
      {todos.length === 0 && (
        <p className="text-xs" style={{ color: '#333333' }}>Nothing yet.</p>
      )}
      <ul className="space-y-0.5">
        {todos.map(todo => (
          <DailyTodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => todosHook.toggle(todo.id)}
            onUpdatePriority={p => todosHook.updatePriority(todo.id, p)}
            onRemove={() => todosHook.remove(todo.id)}
            categories={categories}
          />
        ))}
      </ul>
      <AddTodoInput onAdd={title => todosHook.add(date, title)} />
    </div>
  )
}
