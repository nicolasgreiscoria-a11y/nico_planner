'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="10" y="2" width="6" height="6" rx="1" />
        <rect x="2" y="10" width="6" height="6" rx="1" />
        <rect x="10" y="10" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    href: '/dashboard/schedule',
    label: 'Schedule',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="14" height="13" rx="2" />
        <path d="M6 2v2M12 2v2M2 7h14" />
      </svg>
    ),
  },
  {
    href: '/dashboard/habits',
    label: 'Habits',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2a7 7 0 100 14A7 7 0 009 2z" />
        <path d="M6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: '/dashboard/tasks',
    label: 'Tasks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h12M3 9h8M3 13h6" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="2.5" />
        <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M4.1 4.1l1.1 1.1M12.8 12.8l1.1 1.1M4.1 13.9l1.1-1.1M12.8 5.2l1.1-1.1" />
      </svg>
    ),
  },
]

function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
      style={{
        color: isActive ? '#57bb8A' : 'var(--muted)',
        background: isActive ? 'rgba(87,187,138,0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(87,187,138,0.2)' : '1px solid transparent',
        boxShadow: isActive ? '0 0 12px rgba(87,187,138,0.08)' : 'none',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'var(--glass-surface)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text)'
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
        }
      }}
    >
      <span style={{ color: isActive ? '#57bb8A' : 'inherit' }}>{icon}</span>
      {label}
    </Link>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl cursor-pointer transition-all duration-150"
        style={{
          background: 'var(--glass-strong)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          transition-transform duration-200
          md:translate-x-0 md:static md:h-screen
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: 220,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--glass-border)',
          boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <span
            className="text-lg font-bold tracking-tight"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HabitCircuit
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        {/* Bottom glow accent */}
        <div
          className="mx-4 mb-4 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(87,187,138,0.3), transparent)' }}
        />
      </aside>
    </>
  )
}
