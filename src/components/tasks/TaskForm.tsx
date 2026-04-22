'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Task, TaskDraft, TaskPriority, TaskStatus, TaskType } from '@/lib/hooks/useTasks'

interface TaskFormProps {
  initial?: Task
  onSave: (draft: TaskDraft) => void
  onClose: () => void
}

const inputStyle = {
  background: '#222222',
  border: '1px solid #333333',
  color: '#E8E8E8',
  borderRadius: 8,
  padding: '7px 10px',
  fontSize: 13,
  outline: 'none',
  width: '100%',
} as const

const labelStyle = {
  fontSize: 11,
  color: '#888888',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  fontWeight: 500,
} as const

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

const TASK_TYPES: TaskType[] = ['event', 'project', 'deadline', 'other']
const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low']
const STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed']

export function TaskForm({ initial, onSave, onClose }: TaskFormProps) {
  const t = useTranslations('tasks')
  const tc = useTranslations('common')

  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [taskType, setTaskType] = useState<TaskType>(initial?.task_type ?? 'event')
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'pending')
  const [startDate, setStartDate] = useState(initial?.start_date ?? '')
  const [endDate, setEndDate] = useState(initial?.end_date ?? '')
  const [onCalendar, setOnCalendar] = useState(initial?.on_calendar ?? false)

  // Map internal status keys to message keys
  const statusLabel: Record<TaskStatus, string> = {
    pending: t('statuses.todo'),
    in_progress: t('statuses.in_progress'),
    completed: t('statuses.done'),
  }

  const titleRef = useRef<HTMLInputElement>(null)
  useEffect(() => { titleRef.current?.focus() }, [])

  function handleSave() {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      task_type: taskType,
      priority,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
      on_calendar: onCalendar,
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(15,15,18,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border-strong)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold" style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}>
              {initial ? t('editTask') : t('addTask')}
            </span>
            <button onClick={onClose} className="p-1 rounded hover:bg-[#2A2A2A]" style={{ color: '#888888' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <Field label={t('taskTitle')}>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('taskTitle')}
              style={inputStyle}
              onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
            />
          </Field>

          {/* Description */}
          <Field label={t('description')}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </Field>

          {/* Type + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('type')}>
              <select value={taskType} onChange={e => setTaskType(e.target.value as TaskType)} style={inputStyle}>
                {TASK_TYPES.map(type => (
                  <option key={type} value={type}>{t(`types.${type}`)}</option>
                ))}
              </select>
            </Field>
            <Field label={t('priority')}>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} style={inputStyle}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{t(`priorities.${p}`)}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Status + On Calendar row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('status')}>
              <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} style={inputStyle}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{statusLabel[s]}</option>
                ))}
              </select>
            </Field>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={onCalendar}
                  onChange={e => setOnCalendar(e.target.checked)}
                  className="w-4 h-4 accent-[#57bb8A]"
                />
                <span className="text-sm" style={{ color: '#888888' }}>{t('syncToCalendar')}</span>
              </label>
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('startDate')}>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
            </Field>
            <Field label={t('endDate')}>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-lg transition-colors hover:bg-[#2A2A2A]"
              style={{ color: '#888888' }}
            >
              {tc('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="text-sm px-5 py-2 rounded-lg font-medium disabled:opacity-50"
              style={{ background: '#57bb8A', color: '#0F0F0F' }}
            >
              {initial ? tc('save') : t('addTask')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
