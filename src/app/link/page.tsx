import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'HabitCircuit — Links',
  description: 'Weekly planner + habit tracker. Free to use.',
  openGraph: {
    title: 'HabitCircuit',
    description: 'Weekly planner + habit tracker. Free to use.',
    type: 'website',
  },
}

const links = [
  {
    label: 'Start Using HabitCircuit — Free',
    href: '/login',
    primary: true,
    sublabel: 'No payment required · sign up in seconds',
  },
  {
    label: 'See How It Works',
    href: '/#features',
    primary: false,
  },
  {
    label: 'Follow on Instagram',
    href: 'https://instagram.com/habitcircuitapp',
    primary: false,
    external: true,
  },
  {
    label: 'Follow on TikTok',
    href: 'https://tiktok.com/@habitcircuitapp',
    primary: false,
    external: true,
  },
  {
    label: 'Contact / Support',
    href: 'mailto:habitcircuitapp@gmail.com',
    primary: false,
    external: true,
  },
]

const features = [
  'Weekly schedule grid with 30-min blocks',
  'Habit tracker with weekly stats',
  'Google Calendar sync',
  'Recurring weekly tasks',
  'Daily to-dos + notes',
  'Dark mode · Mobile friendly',
]

export default function LinkPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        color: '#EDEDEF',
        fontFamily: "'IBM Plex Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 20px 80px',
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: 'rgba(87,187,138,0.12)',
          border: '1.5px solid rgba(87,187,138,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: '#57bb8a',
            letterSpacing: '-0.5px',
          }}
        >
          HC
        </span>
      </div>

      {/* Name */}
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: 22,
          margin: '0 0 6px',
          color: '#EDEDEF',
          letterSpacing: '-0.3px',
        }}
      >
        HabitCircuit
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 14,
          color: '#8A8F98',
          margin: '0 0 40px',
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        Weekly planner + habit tracker for people who actually want to follow through.
      </p>

      {/* Link buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {links.map((link) => (
          <LinkButton key={link.href} {...link} />
        ))}
      </div>

      {/* Feature list */}
      <div
        style={{
          marginTop: 52,
          width: '100%',
          maxWidth: 400,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '24px 24px',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: '#8A8F98',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 16px',
          }}
        >
          What you get
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {features.map((f) => (
            <li
              key={f}
              style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#EDEDEF' }}
            >
              <span style={{ color: '#57bb8a', fontSize: 16, lineHeight: 1 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: 20,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: '#57bb8a',
            }}
          >
            Free
          </span>
          <span style={{ fontSize: 13, color: '#8A8F98' }}>no payment · no subscription</span>
        </div>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 40, fontSize: 12, color: '#8A8F98', textAlign: 'center' }}>
        habitcircuitapp.com ·{' '}
        <a href="mailto:habitcircuitapp@gmail.com" style={{ color: '#8A8F98', textDecoration: 'underline' }}>
          habitcircuitapp@gmail.com
        </a>
      </p>
    </main>
  )
}

type LinkButtonProps = {
  label: string
  href: string
  primary: boolean
  sublabel?: string
  external?: boolean
}

function LinkButton({ label, href, primary, sublabel, external }: LinkButtonProps) {
  const inner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: primary ? '#0a0a0c' : '#EDEDEF',
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span
          style={{
            fontSize: 12,
            color: primary ? 'rgba(10,10,12,0.65)' : '#8A8F98',
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  )

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: sublabel ? '16px 20px' : '14px 20px',
    borderRadius: 12,
    textDecoration: 'none',
    transition: 'opacity 0.15s',
    cursor: 'pointer',
    ...(primary
      ? {
          background: '#57bb8a',
          border: 'none',
        }
      : {
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
        }),
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} style={style}>
      {inner}
    </Link>
  )
}
