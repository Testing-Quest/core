import { createContext, useContext } from 'react'

type SettingsContextType = {
  fontSize: string
  highContrast: boolean
  setFontSize(size: string): void
  setHighContrast(highContrast: boolean): void
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
