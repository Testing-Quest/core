import { useContext } from 'react'
import { VisualizationContext } from './VisualizationContext'

export const useVisualization = () => {
  const context = useContext(VisualizationContext)
  if (context === undefined) {
    throw new Error('useVisualization must be used within a VisualizationProvider')
  }
  return context
}
