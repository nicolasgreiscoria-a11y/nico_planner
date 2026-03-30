'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { startOfWeek, addWeeks, subWeeks, format } from 'date-fns'

interface WeekContextValue {
  weekStart: Date
  weekLabel: string
  goToPrevWeek: () => void
  goToNextWeek: () => void
  goToToday: () => void
}

const WeekContext = createContext<WeekContextValue | null>(null)

export function WeekProvider({ children }: { children: ReactNode }) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const goToPrevWeek = useCallback(() => {
    setWeekStart(prev => subWeeks(prev, 1))
  }, [])

  const goToNextWeek = useCallback(() => {
    setWeekStart(prev => addWeeks(prev, 1))
  }, [])

  const goToToday = useCallback(() => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }, [])

  const weekLabel = format(weekStart, "'Week of' MMM d, yyyy")

  return (
    <WeekContext.Provider value={{ weekStart, weekLabel, goToPrevWeek, goToNextWeek, goToToday }}>
      {children}
    </WeekContext.Provider>
  )
}

export function useWeek() {
  const ctx = useContext(WeekContext)
  if (!ctx) throw new Error('useWeek must be used within WeekProvider')
  return ctx
}
