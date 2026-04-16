import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'
export const alt = 'HabitCircuit — Weekly Planner & Habit Tracker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Satori CSS rules: all containers need display:'flex', no filter:blur,
// no background-clip:text, no transform, no backdropFilter.

export default function OGImage() {
  const habits = [
    { name: 'Morning run', done: [1, 1, 1, 0, 1] },
    { name: 'Read 30 min', done: [1, 0, 1, 1, 1] },
    { name: 'No phone AM', done: [1, 1, 0, 1, 0] },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0a0a0c',
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* Subtle green tint block top-left (no blur — Satori doesn't support filter) */}
        <div
          style={{
            position: 'absolute',
            width: 480,
            height: 480,
            top: -200,
            left: -160,
            borderRadius: '50%',
            background: 'rgba(87,187,138,0.07)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            bottom: -140,
            right: -80,
            borderRadius: '50%',
            background: 'rgba(74,144,217,0.06)',
            display: 'flex',
          }}
        />

        {/* Left — brand + copy */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 0,
            bottom: 0,
            width: 560,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              borderRadius: 100,
              background: 'rgba(87,187,138,0.1)',
              border: '1px solid rgba(87,187,138,0.28)',
              marginBottom: 28,
              width: 'fit-content',
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#57bb8A', display: 'flex' }} />
            <span style={{ fontSize: 14, color: '#57bb8A', fontWeight: 600 }}>
              Weekly Planner · Habit Tracker
            </span>
          </div>

          {/* Logo text — solid green (Satori can't do gradient text) */}
          <div style={{ fontSize: 58, fontWeight: 800, letterSpacing: '-2px', color: '#57bb8A', marginBottom: 12, display: 'flex' }}>
            HabitCircuit
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
            <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1.5px', color: '#EDEDEF', lineHeight: 1.1, display: 'flex' }}>
              Stop drifting.
            </span>
            <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1.5px', color: '#4A90D9', lineHeight: 1.1, display: 'flex' }}>
              Start doing.
            </span>
          </div>

          {/* Sub */}
          <div style={{ fontSize: 17, color: '#8A8F98', lineHeight: 1.55, display: 'flex', maxWidth: 460 }}>
            One system for your schedule, habits, tasks, and daily notes.
          </div>

          {/* Feature dots */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {['Schedule', 'Habits', 'Tasks', 'Notes'].map((f) => (
              <div
                key={f}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: 13, color: '#8A8F98', display: 'flex' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — habit tracker card */}
        <div
          style={{
            position: 'absolute',
            right: 64,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
            }}
          >
            {/* Chrome dots + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
              {['#E67C73', '#F6BF26', '#57bb8A'].map((c) => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, display: 'flex' }} />
              ))}
              <span style={{ marginLeft: 8, fontSize: 11, color: '#555', display: 'flex' }}>habit tracker — this week</span>
            </div>

            {/* Header row */}
            <div style={{ display: 'flex', marginBottom: 10, paddingLeft: 130 }}>
              {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
                <div key={i} style={{ width: 34, display: 'flex', justifyContent: 'center', fontSize: 12, color: '#555' }}>{d}</div>
              ))}
            </div>

            {/* Rows */}
            {habits.map((h, hi) => (
              <div key={hi} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 130, fontSize: 13, color: '#EDEDEF', display: 'flex', justifyContent: 'flex-end', paddingRight: 12, opacity: 0.75 }}>
                  {h.name}
                </div>
                {h.done.map((checked, di) => (
                  <div
                    key={di}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: checked ? 'rgba(87,187,138,0.22)' : 'rgba(255,255,255,0.04)',
                      border: checked ? '1px solid rgba(87,187,138,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 6,
                    }}
                  >
                    {checked ? (
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M2 5.5L4.5 8L9 3" stroke="#57bb8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}

            {/* Completion bars */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingLeft: 130 }}>
              {[78, 55, 90, 40, 67].map((pct, i) => (
                <div key={i} style={{ width: 28, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', display: 'flex' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#57bb8A', borderRadius: 2, display: 'flex' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
