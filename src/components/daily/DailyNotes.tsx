'use client'

import { useTranslations } from 'next-intl'

interface DailyNotesProps {
  date: string
  content: string
  saving: boolean
  onChange: (content: string) => void
  onBlur: () => void
}

export function DailyNotes({ date, content, saving, onChange, onBlur }: DailyNotesProps) {
  const td = useTranslations('daily')
  const tc = useTranslations('common')

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: '#555555' }}
        >
          {td('notes')}
        </label>
        {saving && (
          <span className="text-[10px]" style={{ color: '#555555' }}>{tc('saving')}</span>
        )}
      </div>
      <textarea
        value={content}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={td('notesPlaceholder')}
        rows={3}
        className="w-full bg-transparent text-sm resize-none outline-none placeholder-[#333333] leading-relaxed"
        style={{ color: '#E8E8E8' }}
      />
    </div>
  )
}
