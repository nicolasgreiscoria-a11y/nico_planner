import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'
export const alt = 'HabitCircuit — Weekly Planner & Habit Tracker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Satori (the OG image engine) only supports a subset of CSS.
// No: background-clip:text, transform, backdropFilter, border-image.
// All containers need display:'flex'.

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
          overflow: 'hidden',
        }}
      >
        {/* Green glow top-left */}
        <div
          style={{
            position: 'absolute',
            width: 560,
            height: 560,
            top: -180,
            left: -120,
            borderRadius: '50%',
            background: 'rgba(87,187,138,0.14)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />
        {/* Blue glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            width: 460,
            height: 460,
            bottom: -140,
            right: -80,
            borderRadius: '50%',
            background: 'rgba(74,144,217,0.11)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />

        {/* Left column — brand + copy */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Eyebrow pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              background: 'rgba(87,187,138,0.1)',
              border: '1px solid rgba(87,187,138,0.25)',
              marginBottom: 28,
              width: 'fit-content',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#57bb8A',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: 15,
                color: '#57bb8A',
                fontWeight: 500,
              }}
            >
              Weekly Planner · Habit Tracker
            </span>
          </div>

          {/* Wordmark — solid green (Satori can't do gradient text) */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 1,
              color: '#57bb8A',
              marginBottom: 16,
              display: 'flex',
            }}
          >
            HabitCircuit
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-1.5px',
              color: '#EDEDEF',
              lineHeight: 1.15,
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Stop drifting.</span>
            <span style={{ color: '#4A90D9' }}>Start doing.</span>
          </div>

          {/* Sub */}
          <div
            style={{
              fontSize: 18,
              color: '#8A8F98',
              lineHeight: 1.55,
              maxWidth: 440,
              display: 'flex',
            }}
          >
            One system for your schedule, habits, tasks, and daily notes.
          </div>
        </div>

        {/* Right column — habit preview card */}
        <div
          style={{
            position: 'absolute',
            right: 72,
            top: 100,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Chrome dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {['#E67C73', '#F6BF26', '#57bb8A'].map((c) => (
              <div
                key={c}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: c,
                  opacity: 0.8,
                  display: 'flex',
                }}
              />
            ))}
            <span style={{ marginLeft: 8, fontSize: 11, color: '#555', display: 'flex', alignItems: 'center' }}>
              habit tracker — this week
            </span>
          </div>

          {/* Day headers */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 8, paddingLeft: 128 }}>
            {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#555',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Habit rows */}
          {habits.map((h, hi) => (
            <div
              key={hi}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 128,
                  fontSize: 13,
                  color: '#EDEDEF',
                  opacity: 0.75,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingRight: 12,
                }}
              >
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
                    border: checked
                      ? '1px solid rgba(87,187,138,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  {checked ? (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M2 5.5L4.5 8L9 3"
                        stroke="#57bb8A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
              ))}
            </div>
          ))}

          {/* Completion bars */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingLeft: 128 }}>
            {[78, 55, 90, 40, 67].map((pct, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #57bb8A, #4A90D9)',
                    borderRadius: 2,
                    display: 'flex',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
