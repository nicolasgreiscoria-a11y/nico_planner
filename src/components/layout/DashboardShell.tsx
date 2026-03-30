'use client'

import { WeekProvider } from '@/lib/context/WeekContext'
import { ToastProvider } from '@/lib/context/ToastContext'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { Toaster } from '@/components/ui/Toaster'

export function DashboardShell({
  displayName,
  children,
}: {
  displayName: string
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <WeekProvider>
        <div className="flex h-screen overflow-hidden" style={{ background: '#0F0F0F' }}>
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <TopBar displayName={displayName} />
            <main className="flex-1 overflow-auto p-5 md:p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </WeekProvider>
    </ToastProvider>
  )
}
