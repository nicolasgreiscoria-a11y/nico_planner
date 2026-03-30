import { TaskTable } from '@/components/tasks/TaskTable'

export default function TasksPage() {
  return (
    <div className="max-w-5xl space-y-4">
      <h1
        className="text-2xl font-bold"
        style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
      >
        Tasks
      </h1>
      <TaskTable />
    </div>
  )
}
