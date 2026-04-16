'use client'

import { format, startOfWeek, addDays, isWithinInterval } from 'date-fns'
import { useHabits } from '@/lib/hooks/useHabits'
import { useWeeklyTasks } from '@/lib/hooks/useWeeklyTasks'
import { useSchedule } from '@/lib/hooks/useSchedule'
import { useTasks } from '@/lib/hooks/useTasks'
import { useDailyTodos } from '@/lib/hooks/useDailyTodos'
import { useDailyNotes } from '@/lib/hooks/useDailyNotes'
import { useCategories } from '@/lib/hooks/useCategories'
import { CategoryBadge } from '@/components/settings/CategoryBadge'
import { Priority } from '@/lib/hooks/useDailyTodos'

// ─── Shared helpers ───────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<Priority, string> = {
  high: '#E67C73', medium: '#F6BF26', low: '#57bb8A',
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card flex flex-col ${className ?? ''}`}>
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
          {title}
        </h2>
      </div>
      <div className="flex-1 overflow-auto px-4 py-3">
        {children}
      </div>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs" style={{ color: '#444444' }}>{text}</p>
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────

function TodaySchedule({ weekStart, todayIndex }: { weekStart: Date; todayIndex: number }) {
  const { entries } = useSchedule(weekStart)
  const { categories } = useCategories()

  const todayEntries = entries
    .filter(e => e.day_of_week === todayIndex)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))

  return (
    <Card title="Today's Schedule" className="row-span-2">
      {todayEntries.length === 0 ? (
        <Empty text="Nothing scheduled today." />
      ) : (
        <ul className="space-y-2">
          {todayEntries.map(entry => {
            const cat = categories.find(c => c.id === entry.category_id)
            const color = cat?.color ?? '#888888'
            return (
              <li key={entry.id} className="flex items-start gap-2.5">
                <div
                  className="w-1 rounded-full shrink-0 mt-0.5"
                  style={{ background: color, height: 36 }}
                />
                <div>
                  <div className="text-xs font-medium" style={{ color }}>
                    {entry.start_time} – {entry.end_time}
                  </div>
                  <div className="text-sm" style={{ color: '#E8E8E8' }}>
                    {entry.title ?? cat?.name ?? 'Block'}
                  </div>
                  {cat && !entry.title && (
                    <CategoryBadge name={cat.name} color={cat.color} />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Today's Habits ───────────────────────────────────────────────────────────

function TodayHabits({ weekStart, todayStr }: { weekStart: Date; todayStr: string }) {
  const { habits, toggle, isCompleted } = useHabits(weekStart)

  return (
    <Card title="Today's Habits">
      {habits.length === 0 ? (
        <Empty text="No habits set up yet." />
      ) : (
        <ul className="space-y-2">
          {habits.map(habit => {
            const done = isCompleted(habit.id, todayStr)
            return (
              <li key={habit.id} className="flex items-center gap-2.5">
                <button
                  onClick={() => toggle(habit.id, todayStr)}
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-150"
                  style={{
                    background: done ? '#57bb8A' : 'transparent',
                    border: `2px solid ${done ? '#57bb8A' : '#333333'}`,
                  }}
                >
                  {done && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span
                  className="text-sm"
                  style={{
                    color: done ? '#555555' : '#E8E8E8',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {habit.name}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Weekly Tasks ─────────────────────────────────────────────────────────────

function WeeklyTasksCard({ weekStart }: { weekStart: Date }) {
  const { tasks, toggle, isCompleted, completedCount } = useWeeklyTasks(weekStart)

  return (
    <Card title={`Weekly Tasks${tasks.length > 0 ? ` — ${completedCount}/${tasks.length} done` : ''}`}>
      {tasks.length === 0 ? (
        <Empty text="No weekly tasks." />
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => {
            const done = isCompleted(task.id)
            return (
              <li key={task.id} className="flex items-center gap-2.5">
                <button
                  onClick={() => toggle(task.id)}
                  className="w-5 h-5 rounded shrink-0 flex items-center justify-center transition-all duration-150"
                  style={{
                    background: done ? '#57bb8A' : 'transparent',
                    border: `2px solid ${done ? '#57bb8A' : '#333333'}`,
                  }}
                >
                  {done && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span
                  className="text-sm"
                  style={{
                    color: done ? '#555555' : '#E8E8E8',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Upcoming Tasks ───────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  pending:     '#888888',
  in_progress: '#F6BF26',
  completed:   '#57bb8A',
}

function UpcomingTasksCard() {
  const { tasks } = useTasks()
  const today = new Date()
  const sevenDaysOut = addDays(today, 7)
  const todayStr = format(today, 'yyyy-MM-dd')
  const sevenStr = format(sevenDaysOut, 'yyyy-MM-dd')

  const upcoming = tasks
    .filter(t =>
      t.status !== 'completed' &&
      t.end_date !== null &&
      t.end_date >= todayStr &&
      t.end_date <= sevenStr
    )
    .sort((a, b) => (a.end_date ?? '').localeCompare(b.end_date ?? ''))

  return (
    <Card title="Upcoming (next 7 days)">
      {upcoming.length === 0 ? (
        <Empty text="Nothing due in the next 7 days." />
      ) : (
        <ul className="space-y-2.5">
          {upcoming.map(task => (
            <li key={task.id} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                style={{ background: STATUS_COLOR[task.status] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-sm truncate" style={{ color: '#E8E8E8' }}>{task.title}</span>
                  <span className="text-xs shrink-0" style={{ color: '#555555' }}>{task.end_date}</span>
                </div>
                {task.description && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#555555' }}>{task.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// ─── Today's Todos ────────────────────────────────────────────────────────────

function TodayTodosCard({ weekStart, todayStr }: { weekStart: Date; todayStr: string }) {
  const todosHook = useDailyTodos(weekStart)
  const { categories } = useCategories()
  const todos = todosHook.forDate(todayStr)

  return (
    <Card title="Today's To-do">
      {todos.length === 0 ? (
        <Empty text="No to-dos for today." />
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => {
            const cat = categories.find(c => c.id === todo.category_id)
            return (
              <li key={todo.id} className="flex items-start gap-2">
                <button
                  onClick={() => todosHook.toggle(todo.id)}
                  className="w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-all duration-150"
                  style={{
                    background: todo.completed ? '#57bb8A' : 'transparent',
                    border: `1.5px solid ${todo.completed ? '#57bb8A' : '#333333'}`,
                  }}
                >
                  {todo.completed && (
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                      <path d="M1 3.5l1.5 1.5 3.5-3.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: PRIORITY_COLOR[todo.priority] }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: todo.completed ? '#555555' : '#E8E8E8',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    >
                      {todo.title}
                    </span>
                  </div>
                  {cat && <div className="mt-0.5"><CategoryBadge name={cat.name} color={cat.color} /></div>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Today's Notes ────────────────────────────────────────────────────────────

function TodayNotesCard({ weekStart, todayStr }: { weekStart: Date; todayStr: string }) {
  const notesHook = useDailyNotes(weekStart)

  return (
    <Card title="Today's Notes">
      <textarea
        value={notesHook.getNote(todayStr)}
        onChange={e => notesHook.updateNote(todayStr, e.target.value)}
        onBlur={() => notesHook.flushNote(todayStr)}
        placeholder="Notes for today..."
        rows={5}
        className="w-full bg-transparent text-sm resize-none outline-none placeholder-[#333333] leading-relaxed"
        style={{ color: '#E8E8E8' }}
      />
      {notesHook.isSaving(todayStr) && (
        <p className="text-[10px] mt-1" style={{ color: '#555555' }}>saving...</p>
      )}
    </Card>
  )
}

// ─── Main overview ────────────────────────────────────────────────────────────

export function OverviewView() {
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  // today's index in Mon=0 convention
  const jsDay = today.getDay()  // 0=Sun
  const todayIndex = (jsDay + 6) % 7  // Mon=0, Sun=6

  const dateLabel = format(today, 'EEEE, MMMM d')

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
        >
          Overview
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#888888' }}>{dateLabel}</p>
      </div>

      {/* Main grid — 1 col on mobile, 3 col on lg+ */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Schedule spans 2 rows on large screens */}
        <div className="lg:row-span-2">
          <TodaySchedule weekStart={weekStart} todayIndex={todayIndex} />
        </div>
        <TodayHabits weekStart={weekStart} todayStr={todayStr} />
        <WeeklyTasksCard weekStart={weekStart} />
        <TodayTodosCard weekStart={weekStart} todayStr={todayStr} />
        <TodayNotesCard weekStart={weekStart} todayStr={todayStr} />
      </div>

      {/* Upcoming tasks — full width */}
      <UpcomingTasksCard />
    </div>
  )
}
