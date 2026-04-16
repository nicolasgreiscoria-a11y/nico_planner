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
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
          {/* Ambient gradient blobs */}
          <div
            className="blob"
            style={{
              width: 600,
              height: 600,
              top: '-10%',
              left: '-5%',
              background: 'radial-gradient(circle, rgba(87,187,138,0.09) 0%, transparent 70%)',
              animation: 'blob-drift 18s ease-in-out infinite',
            }}
          />
          <div
            className="blob"
            style={{
              width: 500,
              height: 500,
              bottom: '-5%',
              right: '10%',
              background: 'radial-gradient(circle, rgba(74,144,217,0.07) 0%, transparent 70%)',
              animation: 'blob-drift-alt 22s ease-in-out infinite',
            }}
          />
          <div
            className="blob"
            style={{
              width: 400,
              height: 400,
              top: '40%',
              right: '-5%',
              background: 'radial-gradient(circle, rgba(87,187,138,0.05) 0%, transparent 70%)',
              animation: 'blob-drift 26s ease-in-out infinite reverse',
            }}
          />

          {/* Layout */}
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 relative z-10">
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
