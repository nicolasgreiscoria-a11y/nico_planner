'use client'

import { useState } from 'react'
import { Task, TaskPriority, TaskStatus, TaskType, useTasks } from '@/lib/hooks/useTasks'
import { TaskForm } from './TaskForm'
import { useToast } from '@/lib/context/ToastContext'

// ─── Visual helpers ───────────────────────────────────────────────────────────

const STATUS_STYLE: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Pending',     color: '#888888', bg: '#88888818' },
  in_progress: { label: 'In Progress', color: '#F6BF26', bg: '#F6BF2618' },
  completed:   { label: 'Completed',   color: '#57bb8A', bg: '#57bb8A18' },
}

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  high:   '#E67C73',
  medium: '#F6BF26',
  low:    '#57bb8A',
}

const TYPE_LABEL: Record<TaskType, string> = {
  event:    'Event',
  project:  'Project',
  deadline: 'Deadline',
  other:    'Other',
}

function StatusBadge({ status, onClick }: { status: TaskStatus; onClick: () => void }) {
  const s = STATUS_STYLE[status]
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}
      title="Click to advance status"
    >
      {s.label}
    </button>
  )
}

function CalendarIcon() {
  return (
    <span title="On Calendar">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#57bb8A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="2" width="11" height="10" rx="1.5" />
        <path d="M4 1v2M9 1v2M1 5h11" />
      </svg>
    </span>
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  onCycleStatus,
  onEdit,
  onDelete,
}: {
  task: Task
  onCycleStatus: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <tr
      className="group transition-colors hover:bg-[#1E1E1E] cursor-pointer"
      onClick={onEdit}
      style={{ borderTop: '1px solid #1E1E1E' }}
    >
      {/* Type */}
      <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: '#888888' }}>
        {TYPE_LABEL[task.task_type]}
      </td>

      {/* Title */}
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: '#E8E8E8' }}>
            {task.title}
          </span>
          {task.on_calendar && <CalendarIcon />}
        </div>
        {task.description && (
          <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: '#555555' }}>
            {task.description}
          </p>
        )}
      </td>

      {/* Priority */}
      <td className="px-4 py-2.5 text-center">
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: PRIORITY_COLOR[task.priority] }}
          title={task.priority}
        />
      </td>

      {/* Start date */}
      <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: '#888888' }}>
        {task.start_date ?? '—'}
      </td>

      {/* End date */}
      <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: '#888888' }}>
        {task.end_date ?? '—'}
      </td>

      {/* Status */}
      <td className="px-4 py-2.5" onClick={e => { e.stopPropagation(); onCycleStatus() }}>
        <StatusBadge status={task.status} onClick={onCycleStatus} />
      </td>

      {/* Delete */}
      <td className="px-3 py-2.5 text-center">
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#2A2A2A]"
          style={{ color: '#555555' }}
          title="Delete task"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 3.5h9M5 3.5V2h3v1.5M5.5 6v4M7.5 6v4M3 3.5l.6 7h5.8l.6-7" />
          </svg>
        </button>
      </td>
    </tr>
  )
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type Filter = 'all' | TaskStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'pending',    label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed',  label: 'Completed' },
]

// ─── Main table ───────────────────────────────────────────────────────────────

async function calendarSync(taskId: string): Promise<string | null> {
  const res = await fetch('/api/calendar/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return data.error ?? 'Calendar sync failed'
  }
  return null
}

async function calendarDelete(taskId: string): Promise<string | null> {
  const res = await fetch('/api/calendar/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return data.error ?? 'Calendar delete failed'
  }
  return null
}

export function TaskTable() {
  const { tasks, loading, add, update, cycleStatus, remove } = useTasks()
  const { addToast } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [creating, setCreating] = useState(false)

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  const counts: Record<Filter, number> = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex items-center gap-1" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 10, padding: 3 }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: filter === f.key ? '#2A2A2A' : 'transparent',
                color: filter === f.key ? '#E8E8E8' : '#888888',
              }}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span
                  className="ml-1.5 text-[10px] px-1 py-0.5 rounded-full"
                  style={{ background: filter === f.key ? '#57bb8A22' : '#55555522', color: filter === f.key ? '#57bb8A' : '#666666' }}
                >
                  {counts[f.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* New task button */}
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: '#57bb8A', color: '#0F0F0F' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 2v10M2 7h10" />
          </svg>
          New task
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
        {loading ? (
          <div className="p-6 text-center text-sm" style={{ color: '#888888' }}>Loading tasks...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
                  {['Type', 'Title', 'Priority', 'Start', 'Due', 'Status', ''].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide"
                      style={{ color: '#888888' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: '#555555' }}>
                      {filter === 'all' ? 'No tasks yet. Create one above.' : `No ${filter.replace('_', ' ')} tasks.`}
                    </td>
                  </tr>
                ) : (
                  filtered.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onCycleStatus={() => cycleStatus(task.id)}
                      onEdit={() => setEditingTask(task)}
                      onDelete={async () => {
                        if (task.on_calendar) await calendarDelete(task.id)
                        remove(task.id)
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create modal */}
      {creating && (
        <TaskForm
          onSave={async draft => {
            const newTask = await add(draft)
            if (newTask && draft.on_calendar) {
              const err = await calendarSync(newTask.id)
              if (err) addToast(err, 'error')
              else addToast('Added to Google Calendar', 'success')
            }
            setCreating(false)
          }}
          onClose={() => setCreating(false)}
        />
      )}

      {/* Edit modal */}
      {editingTask && (
        <TaskForm
          initial={editingTask}
          onSave={async draft => {
            await update(editingTask.id, draft)
            if (draft.on_calendar) {
              const err = await calendarSync(editingTask.id)
              if (err) addToast(err, 'error')
              else addToast('Calendar event updated', 'success')
            } else if (!draft.on_calendar && editingTask.on_calendar) {
              const err = await calendarDelete(editingTask.id)
              if (err) addToast(err, 'error')
            }
            setEditingTask(null)
          }}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
