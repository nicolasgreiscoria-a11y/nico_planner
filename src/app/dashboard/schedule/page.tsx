import { WeekGrid } from '@/components/schedule/WeekGrid'
import { WeeklyTaskList } from '@/components/weekly-tasks/WeeklyTaskList'
import { DailyPanels } from '@/components/daily/DailyPanels'

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row: grid + weekly tasks */}
      <div
        className="flex gap-5"
        style={{ height: 'calc(100vh - 56px - 48px - 56px)' }}
      >
        <div className="flex flex-col flex-1 min-w-0">
          <h1
            className="text-2xl font-bold mb-4 shrink-0"
            style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
          >
            Schedule
          </h1>
          <div className="flex-1 min-h-0 relative">
            <WeekGrid />
          </div>
        </div>

        <div className="shrink-0 w-64 pt-14">
          <WeeklyTaskList />
        </div>
      </div>

      {/* Bottom row: daily to-do + notes panels */}
      <DailyPanels />
    </div>
  )
}
