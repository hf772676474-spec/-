import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Survey } from '../types'

const initial: Survey = {
  populationId: 'P01',
  goal: 'attention',
  mobility: 'normal',
  duration: 'medium',
  companion: 'solo',
}

type ContextValue = { survey: Survey; setSurvey: (value: Survey) => void }
const AppContext = createContext<ContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [survey, setSurveyState] = useState<Survey>(() => {
    try {
      const saved = localStorage.getItem('senyu-survey')
      return saved ? { ...initial, ...JSON.parse(saved) } : initial
    } catch {
      return initial
    }
  })
  const setSurvey = (value: Survey) => {
    setSurveyState(value)
    localStorage.setItem('senyu-survey', JSON.stringify(value))
  }
  const context = useMemo(() => ({ survey, setSurvey }), [survey])
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp 必须在 AppProvider 中使用')
  return context
}

