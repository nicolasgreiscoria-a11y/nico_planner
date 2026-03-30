import { HabitTable } from '@/components/habits/HabitTable'

export default function HabitsPage() {
  return (
    <div className="max-w-4xl space-y-4">
      <h1
        className="text-2xl font-bold"
        style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
      >
        Habits
      </h1>
      <HabitTable />
    </div>
  )
}
