import React from 'react'
import { Client } from '../../../Client'
import { HealthMulti } from './components/Health'
import { VisualizationProvider } from './context/VisualizationContext'
import VisualizationRenderer from './context/VisualizationRenderer'
import type { AnalysisVisualization } from './types'
import Sidebar from './Sidebar'
import type { AnalysisQuest } from './types'

type AnalysisTabProps = {
  quest: AnalysisQuest
}

export const analysisVisualizations: AnalysisVisualization[] = [
  { label: 'Health', icon: 'basic', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Health1', icon: 'basic', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Health2', icon: 'basic', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Health3', icon: 'basic', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Health4', icon: 'basic', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Health5', icon: 'basic', multi: HealthMulti, gradu: null, binary: null },
]

const AnalysisTab: React.FC<AnalysisTabProps> = ({ quest }) => {
  const client = new Client(quest)
  const questType = client.getQuestType()

  const questVisualizations = analysisVisualizations.filter(visualization => {
    return visualization[questType as keyof AnalysisVisualization] !== null
  })

  if (questVisualizations.length === 0) {
    return <div>No hay visualizaciones disponibles para este tipo de quest.</div>
  }

  return (
    <VisualizationProvider initialVisualization={questVisualizations[0]}>
      <div style={{ display: 'flex' }}>
        <div style={{ position: 'fixed', left: 0, height: '100%', width: '14.7%', zIndex: 999 }}>
          <Sidebar visualizations={questVisualizations} />
        </div>
        <div style={{ marginLeft: '16%', width: '84%' }}>
          <VisualizationRenderer client={client} />
        </div>
      </div>
    </VisualizationProvider>
  )
}

export default AnalysisTab
