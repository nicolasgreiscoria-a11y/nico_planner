import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

const DEFAULT_CATEGORIES = [
  { name: 'Work',      color: '#4A90D9' },
  { name: 'Study',     color: '#57bb8A' },
  { name: 'Exercise',  color: '#E67C73' },
  { name: 'Meals',     color: '#FF8A65' },
  { name: 'Social',    color: '#F6BF26' },
  { name: 'Personal',  color: '#8E24AA' },
  { name: 'Rest',      color: '#78909C' },
  { name: 'Other',     color: '#5C6BC0' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Seed default categories on first load
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count === 0) {
    await supabase.from('categories').insert(
      DEFAULT_CATEGORIES.map((cat, i) => ({
        user_id: user.id,
        name: cat.name,
        color: cat.color,
        sort_order: i,
      }))
    )
  }

  // Fetch display name from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Nico'

  return (
    <DashboardShell displayName={displayName}>
      {children}
    </DashboardShell>
  )
}
