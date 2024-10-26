import React, { createContext, useState } from 'react'
import type { ReactNode } from 'react'

type SettingsContextType = {
  fontSize: string
  highContrast: boolean
  setFontSize(size: string): void
  setHighContrast(highContrast: boolean): void
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

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
