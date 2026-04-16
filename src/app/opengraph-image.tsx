import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'
export const alt = 'HabitCircuit'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0a0a0c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: '#57bb8A', display: 'flex' }}>
          HabitCircuit
        </div>
        <div style={{ fontSize: 32, color: '#EDEDEF', display: 'flex' }}>
          Stop drifting. Start doing.
        </div>
        <div style={{ fontSize: 18, color: '#8A8F98', display: 'flex' }}>
          Weekly Planner · Habit Tracker · Task Manager
        </div>
      </div>
    ),
    { ...size }
  )
}
