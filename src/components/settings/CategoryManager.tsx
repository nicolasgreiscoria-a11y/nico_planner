'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCategories } from '@/lib/hooks/useCategories'
import { CategoryBadge } from './CategoryBadge'

function CategoryRow({
  id,
  name,
  color,
  onUpdate,
  onRemove,
}: {
  id: string
  name: string
  color: string
  onUpdate: (id: string, changes: { name?: string; color?: string }) => void
  onRemove: (id: string) => void
}) {
  const t = useTranslations('settings')
  const tc = useTranslations('common')
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(name)
  const [draftColor, setDraftColor] = useState(color)

  function commit() {
    const trimmed = draftName.trim()
    if (trimmed) onUpdate(id, { name: trimmed, color: draftColor })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="flex items-center gap-3 py-2.5 px-3 rounded-lg" style={{ background: '#222222' }}>
        <input
          type="color"
          value={draftColor}
          onChange={e => setDraftColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          title="Pick color"
        />
        <input
          autoFocus
          type="text"
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: '#E8E8E8' }}
        />
        <button
          onClick={commit}
          className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
          style={{ background: '#57bb8A22', color: '#57bb8A', border: '1px solid #57bb8A44' }}
        >
          {tc('save')}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs px-2.5 py-1 rounded-md transition-colors hover:bg-[#2A2A2A]"
          style={{ color: '#888888' }}
        >
          {tc('cancel')}
        </button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 py-2.5 px-3 rounded-lg group hover:bg-[#1E1E1E] transition-colors">
      <span className="w-4 h-4 rounded-full shrink-0" style={{ background: color }} />
      <span className="flex-1 text-sm" style={{ color: '#E8E8E8' }}>{name}</span>
      <CategoryBadge name={name} color={color} />
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => { setDraftName(name); setDraftColor(color); setEditing(true) }}
          className="p-1.5 rounded-md hover:bg-[#2A2A2A] transition-colors"
          style={{ color: '#888888' }}
          title={tc('edit')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2l2 2-7 7H3v-2l7-7z" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(id)}
          className="p-1.5 rounded-md hover:bg-[#2A2A2A] transition-colors"
          style={{ color: '#888888' }}
          title={t('deleteCategory')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4h10M5 4V2h4v2M5.5 7v4M8.5 7v4M3 4l.7 8h6.6L11 4" />
          </svg>
        </button>
      </div>
    </li>
  )
}

export function CategoryManager() {
  const t = useTranslations('settings')
  const tc = useTranslations('common')
  const { categories, loading, add, update, remove } = useCategories()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#57bb8A')

  async function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    await add(trimmed, newColor)
    setNewName('')
    setNewColor('#57bb8A')
  }

  if (loading) {
    return <p className="text-sm" style={{ color: '#888888' }}>{tc('loading')}</p>
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-1">
        {categories.map(cat => (
          <CategoryRow
            key={cat.id}
            {...cat}
            onUpdate={update}
            onRemove={remove}
          />
        ))}
        {categories.length === 0 && (
          <li className="text-sm py-4 text-center" style={{ color: '#888888' }}>
            {t('noCategories')}
          </li>
        )}
      </ul>

      {/* Add new */}
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
        style={{ border: '1px dashed #2A2A2A' }}
      >
        <input
          type="color"
          value={newColor}
          onChange={e => setNewColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          title="Pick color"
        />
        <input
          type="text"
          placeholder={t('categoryName')}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          className="flex-1 bg-transparent text-sm outline-none placeholder-[#444444]"
          style={{ color: '#E8E8E8' }}
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-40"
          style={{ background: '#57bb8A', color: '#0F0F0F' }}
        >
          {tc('add')}
        </button>
      </div>
    </div>
  )
}
