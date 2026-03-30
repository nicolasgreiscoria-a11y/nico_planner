'use client'

import { useEffect, useRef, useState } from 'react'
import { Category } from '@/lib/hooks/useCategories'

interface SlotEditorProps {
  mode: 'create' | 'edit'
  initialTitle: string | null
  initialCategoryId: string | null
  initialStartTime: string
  initialEndTime: string
  dayLabel: string
  categories: Category[]
  onSave: (data: {
    title: string | null
    categoryId: string | null
    startTime: string
    endTime: string
    isRecurring: boolean
  }) => void
  onDelete?: () => void
  onClose: () => void
}

const END_TIMES = (startTime: string): string[] => {
  const [h, m] = startTime.split(':').map(Number)
  const startMinutes = h * 60 + m
  const result: string[] = []
  for (let offset = 30; offset <= 240; offset += 30) {
    const total = startMinutes + offset
    if (total > 24 * 60) break
    const hh = Math.floor(total / 60).toString().padStart(2, '0')
    const mm = (total % 60).toString().padStart(2, '0')
    result.push(`${hh}:${mm}`)
  }
  return result
}

export function SlotEditor({
  mode,
  initialTitle,
  initialCategoryId,
  initialStartTime,
  initialEndTime,
  dayLabel,
  categories,
  onSave,
  onDelete,
  onClose,
}: SlotEditorProps) {
  const [title, setTitle] = useState(initialTitle ?? '')
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? '')
  const [startTime, setStartTime] = useState(initialStartTime)
  const [endTime, setEndTime] = useState(initialEndTime)
  const [isRecurring, setIsRecurring] = useState(true)

  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Keep endTime valid when startTime changes
  useEffect(() => {
    const validEnds = END_TIMES(startTime)
    if (!validEnds.includes(endTime)) {
      setEndTime(validEnds[0] ?? endTime)
    }
  }, [startTime, endTime])

  const selectedCategory = categories.find(c => c.id === categoryId)

  function handleSave() {
    onSave({
      title: title.trim() || null,
      categoryId: categoryId || null,
      startTime,
      endTime,
      isRecurring,
    })
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
  }

  const labelStyle = {
    fontSize: 11,
    color: '#888888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 500,
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="w-full max-w-sm rounded-xl p-5 space-y-4"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}>
              {mode === 'create' ? 'Add block' : 'Edit block'} — {dayLabel}
            </span>
            <button onClick={onClose} className="p-1 rounded hover:bg-[#2A2A2A]" style={{ color: '#888888' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label style={labelStyle}>Title</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Lecture, Practice..."
              style={inputStyle}
              onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label style={labelStyle}>Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              style={{
                ...inputStyle,
                color: selectedCategory ? selectedCategory.color : '#E8E8E8',
              }}
            >
              <option value="">— No category —</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} style={{ color: cat.color }}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time range */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <label style={labelStyle}>Start</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label style={labelStyle}>End</label>
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                style={inputStyle}
              >
                {END_TIMES(startTime).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurring toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
              className="w-4 h-4 accent-[#57bb8A]"
            />
            <span className="text-sm" style={{ color: '#888888' }}>Repeat every week</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            {mode === 'edit' && onDelete ? (
              <button
                onClick={onDelete}
                className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-[#2A2A2A]"
                style={{ color: '#E67C73' }}
              >
                Delete
              </button>
            ) : <span />}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-[#2A2A2A]"
                style={{ color: '#888888' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-xs px-4 py-1.5 rounded-md font-medium"
                style={{ background: '#57bb8A', color: '#0F0F0F' }}
              >
                {mode === 'create' ? 'Add' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
