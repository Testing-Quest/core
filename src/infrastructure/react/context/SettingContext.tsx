import type { ReactNode } from 'react'
import React, { createContext, useState, useContext } from 'react'

type SettingsContextType = {
  fontSize: string
  highContrast: boolean
  setFontSize(size: string): void
  setHighContrast(highContrast: boolean): void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

type SettingsProviderProps = {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [fontSize, setFontSize] = useState('16px')
  const [highContrast, setHighContrast] = useState(false)

  return (
    <SettingsContext.Provider value={{ fontSize, highContrast, setFontSize, setHighContrast }}>
      {children}
    </SettingsContext.Provider>
  )
}
