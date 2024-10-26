import type { ReactNode } from 'react'
import React, { createContext, useState } from 'react'
import type { AnalysisVisualization } from '../types'

type VisualizationContextType = {
  selectedVisualization: AnalysisVisualization | null
  setSelectedVisualization(visualization: AnalysisVisualization): void
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined)

export const VisualizationProvider: React.FC<{ children: ReactNode; initialVisualization: AnalysisVisualization }> = ({
  children,
  initialVisualization,
}) => {
  const [selectedVisualization, setSelectedVisualization] = useState<AnalysisVisualization>(initialVisualization)

  return (
    <VisualizationContext.Provider value={{ selectedVisualization, setSelectedVisualization }}>
      {children}
    </VisualizationContext.Provider>
  )
}

export { VisualizationContext }
