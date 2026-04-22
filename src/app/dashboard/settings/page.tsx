import { CategoryManager } from '@/components/settings/CategoryManager'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { GoogleCalendarSection } from '@/components/settings/GoogleCalendarSection'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="glass-card p-6"
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

export default async function SettingsPage() {
  const t = await getTranslations('settings')

  return (
    <div className="max-w-2xl space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}
      >
        {t('profile')}
      </h1>

      <Section title={t('profile')}>
        <ProfileSettings />
      </Section>

      <Section title={t('categories')}>
        <CategoryManager />
      </Section>

      <Section title={t('googleCalendar')}>
        <Suspense fallback={<p className="text-sm" style={{ color: '#888888' }}>...</p>}>
          <GoogleCalendarSection />
        </Suspense>
      </Section>
    </div>
  )
}
