import React, { useState } from 'react'
import type { ReactNode } from 'react'
import { SettingsContext } from './useSettings'

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
