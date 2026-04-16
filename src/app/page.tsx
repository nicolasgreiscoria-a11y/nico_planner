import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'HabitCircuit — Weekly Planner & Habit Tracker',
  description:
    'HabitCircuit is a structured weekly planner, habit tracker, and task manager built for students who want to follow through.',
  openGraph: {
    title: 'HabitCircuit — Weekly Planner & Habit Tracker',
    description:
      'HabitCircuit is a structured weekly planner, habit tracker, and task manager built for students who want to follow through.',
    type: 'website',
  },
}

// ─── Mini app preview ─────────────────────────────────────────────────────────

function HabitPreview() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const habits = [
    { name: 'Morning run',    done: [1, 1, 1, 0, 1, 1, 0] },
    { name: 'Read 30 min',    done: [1, 0, 1, 1, 1, 0, 1] },
    { name: 'No phone AM',    done: [1, 1, 0, 1, 0, 1, 1] },
    { name: 'Gym',            done: [0, 1, 1, 0, 1, 0, 0] },
  ]
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 580,
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E67C73', opacity: 0.8 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F6BF26', opacity: 0.8 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#57bb8A', opacity: 0.8 }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: '#555', fontFamily: 'IBM Plex Sans, sans-serif' }}>
          habit tracker — this week
        </span>
      </div>

      {/* Table */}
      <div style={{ padding: '8px 0 16px' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(7, 32px)', gap: 4, padding: '0 16px 8px' }}>
          <div />
          {days.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, color: '#666', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Rows */}
        {habits.map((h, hi) => (
          <div
            key={hi}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr repeat(7, 32px)',
              gap: 4,
              padding: '6px 16px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: '#EDEDEF', fontFamily: 'IBM Plex Sans, sans-serif', opacity: 0.8 }}>
              {h.name}
            </span>
            {h.done.map((checked, di) => (
              <div
                key={di}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: checked
                    ? 'rgba(87,187,138,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  border: checked
                    ? '1px solid rgba(87,187,138,0.4)'
                    : '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                {checked ? (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5L4.5 8L9 3" stroke="#57bb8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </div>
            ))}
          </div>
        ))}
        {/* Weekly bar */}
        <div style={{ padding: '12px 16px 0', display: 'flex', gap: 6 }}>
          {[78, 55, 90, 40].map((pct, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #57bb8A, #4A90D9)',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SchedulePreview() {
  const hours = ['9am', '10am', '11am', '12pm', '1pm']
  const events = [
    { col: 0, row: 0, span: 2, label: 'Class',  color: '#57bb8A' },
    { col: 1, row: 0, span: 1, label: 'Gym',    color: '#E67C73' },
    { col: 2, row: 1, span: 2, label: 'Tennis', color: '#4A90D9' },
    { col: 3, row: 0, span: 1, label: 'Class',  color: '#57bb8A' },
    { col: 4, row: 2, span: 2, label: 'Study',  color: '#8E24AA' },
  ]
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        padding: '14px 16px',
        width: '100%',
        maxWidth: 320,
      }}
    >
      <p style={{ fontSize: 11, color: '#666', fontFamily: 'IBM Plex Sans', marginBottom: 10 }}>weekly schedule</p>
      <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(5, 1fr)', gap: 3 }}>
        {/* Time col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {hours.map(h => (
            <span key={h} style={{ fontSize: 9, color: '#444', fontFamily: 'IBM Plex Sans' }}>{h}</span>
          ))}
        </div>
        {/* Day cols */}
        {[0,1,2,3,4].map(col => (
          <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {hours.map((_, row) => {
              const ev = events.find(e => e.col === col && e.row === row)
              if (ev) {
                return (
                  <div
                    key={row}
                    style={{
                      height: ev.span === 2 ? 42 : 18,
                      borderRadius: 4,
                      background: `${ev.color}22`,
                      border: `1px solid ${ev.color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 4,
                    }}
                  >
                    <span style={{ fontSize: 8, color: ev.color, fontFamily: 'IBM Plex Sans' }}>{ev.label}</span>
                  </div>
                )
              }
              // Skip if previous event had span=2
              const above = events.find(e => e.col === col && e.row === row - 1 && e.span === 2)
              if (above) return null
              return (
                <div
                  key={row}
                  style={{
                    height: 18,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Feature cards ────────────────────────────────────────────────────────────

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
}

function FeatureCard({ icon, title, desc, color }: Feature) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '28px 28px 32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <h3
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 17,
            fontWeight: 600,
            color: '#EDEDEF',
            marginBottom: 6,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: 14,
            color: '#8A8F98',
            lineHeight: 1.65,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

// ─── Schema.org structured data ──────────────────────────────────────────────

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HabitCircuit',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  url: 'https://nico-planner.vercel.app',
  description:
    'HabitCircuit is a weekly planner, habit tracker, and task manager built for students who want to follow through on their goals.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Weekly schedule with 30-minute time blocks',
    'Daily habit tracker with completion rates',
    'Task manager with Google Calendar sync',
    'Daily to-do lists and notes',
  ],
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  const features: Feature[] = [
    {
      color: '#4A90D9',
      title: 'Weekly Schedule',
      desc: '30-minute time blocks across 7 days. Color-code by category — class, gym, meals, study — and see your whole week at a glance.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="16" height="15" rx="2" />
          <path d="M6 2v2M14 2v2M2 8h16" />
          <path d="M6 12h2v2H6z" fill="#4A90D9" stroke="none" />
          <path d="M9 12h2v2H9z" fill="#4A90D9" stroke="none" opacity="0.4" />
        </svg>
      ),
    },
    {
      color: '#57bb8A',
      title: 'Habit Tracker',
      desc: 'Check off daily habits Mon–Sun. Track weekly completion rates and watch streaks build over time without the guilt trip.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#57bb8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10l4 4 8-8" />
          <circle cx="10" cy="10" r="8" />
        </svg>
      ),
    },
    {
      color: '#F6BF26',
      title: 'Task Manager',
      desc: 'Capture big events, deadlines, and projects with priority, status, and dates. Sync directly to Google Calendar in one click.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#F6BF26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5h12M4 10h8M4 15h5" />
          <path d="M14 13l2 2 3-3" />
        </svg>
      ),
    },
    {
      color: '#E67C73',
      title: 'Daily Focus',
      desc: 'Per-day to-do lists and notes keep you anchored to what matters today, without the noise of everything else on your plate.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#E67C73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path d="M8 9h4M8 12h2" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Ambient blobs ── */}
      <div className="blob" style={{ width: 700, height: 700, top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(87,187,138,0.10) 0%, transparent 65%)', animation: 'blob-drift 20s ease-in-out infinite' }} />
      <div className="blob" style={{ width: 600, height: 600, top: '10%', right: '-10%', background: 'radial-gradient(circle, rgba(74,144,217,0.08) 0%, transparent 65%)', animation: 'blob-drift-alt 26s ease-in-out infinite' }} />
      <div className="blob" style={{ width: 500, height: 500, bottom: '5%', left: '20%', background: 'radial-gradient(circle, rgba(87,187,138,0.06) 0%, transparent 65%)', animation: 'blob-drift 30s ease-in-out infinite reverse' }} />

      {/* ── Nav ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(10,10,12,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 700,
              fontSize: 20,
              background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HabitCircuit
          </span>
          <Link
            href="/login"
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: '#8A8F98',
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              transition: 'color 150ms ease, border-color 150ms ease',
            }}
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '96px 24px 40px' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>

          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              background: 'rgba(87,187,138,0.08)',
              border: '1px solid rgba(87,187,138,0.2)',
              marginBottom: 32,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#57bb8A', boxShadow: '0 0 8px #57bb8A' }} />
            <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 13, color: '#57bb8A', fontWeight: 500 }}>
              Schedule · Habits · Tasks · Notes
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(42px, 7vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#EDEDEF',
              marginBottom: 24,
            }}
          >
            Stop drifting.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Start doing.
            </span>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.7,
              color: '#8A8F98',
              marginBottom: 44,
              maxWidth: 540,
              margin: '0 auto 44px',
            }}
          >
            HabitCircuit replaces scattered spreadsheets with one clean system — a weekly planner, habit tracker, and task manager built for students who want to actually follow through.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
                color: '#0a0a0c',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(87,187,138,0.3)',
                transition: 'opacity 150ms ease, transform 150ms ease',
              }}
            >
              Get started free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '14px 28px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#EDEDEF',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                fontSize: 15,
                textDecoration: 'none',
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Hero visual — stacked previews */}
        <div
          style={{
            marginTop: 72,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 20,
            position: 'relative',
          }}
        >
          {/* Habit tracker (main) */}
          <div style={{ transform: 'translateY(16px)', animation: 'fade-in-up 400ms ease-out 100ms both' }}>
            <HabitPreview />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#EDEDEF',
              marginBottom: 12,
            }}
          >
            Everything in one place
          </h2>
          <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 16, color: '#8A8F98', lineHeight: 1.65, maxWidth: 440, margin: '0 auto' }}>
            No more juggling five different apps. HabitCircuit keeps your schedule, habits, tasks, and daily notes under one roof.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div
          style={{
            borderRadius: 24,
            padding: '64px 40px',
            textAlign: 'center',
            background: 'rgba(87,187,138,0.06)',
            border: '1px solid rgba(87,187,138,0.15)',
            boxShadow: '0 0 80px rgba(87,187,138,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <h2
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#EDEDEF',
              marginBottom: 14,
            }}
          >
            Ready to build real habits?
          </h2>
          <p
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 16,
              color: '#8A8F98',
              lineHeight: 1.65,
              maxWidth: 480,
              margin: '0 auto 36px',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            Free to use. No credit card required. Your data stays yours.
          </p>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
              color: '#0a0a0c',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(87,187,138,0.3)',
            }}
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '24px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 13, color: '#444' }}>
          © 2026 HabitCircuit — Built with intention.
        </p>
      </footer>
    </div>
    </>
  )
}
