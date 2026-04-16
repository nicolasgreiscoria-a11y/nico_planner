import { ImageResponse } from 'next/og'

export const alt = 'HabitCircuit — Weekly Planner & Habit Tracker'
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow top-left */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            top: -200,
            left: -150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(87,187,138,0.18) 0%, transparent 65%)',
          }}
        />
        {/* Background glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            bottom: -150,
            right: -100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,144,217,0.13) 0%, transparent 65%)',
          }}
        />

        {/* Mini habit preview card */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Chrome dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            {['#E67C73', '#F6BF26', '#57bb8A'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
          </div>
          {/* Day headers */}
          <div style={{ display: 'flex', gap: 8, paddingLeft: 120 }}>
            {['M','T','W','T','F'].map((d, i) => (
              <div key={i} style={{ width: 28, textAlign: 'center', fontSize: 11, color: '#555' }}>{d}</div>
            ))}
          </div>
          {/* Habit rows */}
          {[
            { name: 'Morning run', done: [1,1,1,0,1] },
            { name: 'Read 30 min',  done: [1,0,1,1,1] },
            { name: 'No phone AM', done: [1,1,0,1,0] },
          ].map((h, hi) => (
            <div key={hi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 112, fontSize: 12, color: '#EDEDEF', opacity: 0.7, textAlign: 'right' }}>{h.name}</div>
              {h.done.map((checked, di) => (
                <div
                  key={di}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: checked ? 'rgba(87,187,138,0.2)' : 'rgba(255,255,255,0.04)',
                    border: checked ? '1px solid rgba(87,187,138,0.45)' : '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {checked ? (
                    <div style={{ width: 10, height: 10, color: '#57bb8A', fontSize: 10 }}>✓</div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Left content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'absolute',
            left: 80,
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: 560,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              background: 'rgba(87,187,138,0.08)',
              border: '1px solid rgba(87,187,138,0.22)',
              marginBottom: 24,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#57bb8A' }} />
            <span style={{ fontSize: 14, color: '#57bb8A', fontWeight: 500 }}>
              Weekly Planner · Habit Tracker
            </span>
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 8,
              background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            HabitCircuit
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#EDEDEF',
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Stop drifting.{'\n'}Start doing.
          </div>

          {/* Sub */}
          <div style={{ fontSize: 17, color: '#8A8F98', lineHeight: 1.6, maxWidth: 440 }}>
            One system for your schedule, habits, tasks, and daily notes.
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
