import { CategoryManager } from '@/components/settings/CategoryManager'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { GoogleCalendarSection } from '@/components/settings/GoogleCalendarSection'
import { Suspense } from 'react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-xl p-6"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <h2
        className="text-base font-semibold mb-5"
        style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
      >
        Settings
      </h1>

      <Section title="Profile">
        <ProfileSettings />
      </Section>

      <Section title="Categories">
        <CategoryManager />
      </Section>

      <Section title="Google Calendar">
        <Suspense fallback={<p className="text-sm" style={{ color: '#888888' }}>Loading...</p>}>
          <GoogleCalendarSection />
        </Suspense>
      </Section>
    </div>
  )
}
