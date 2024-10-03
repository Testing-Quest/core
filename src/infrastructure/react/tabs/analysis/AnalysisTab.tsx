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
  { label: 'Reliability', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Items Map', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Direct Weighted', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Direct Blank', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Direct Coherency', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Direct MCI', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Score Distribution', icon: 'plot', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Items Table', icon: 'table', multi: HealthMulti, gradu: null, binary: null },
  { label: 'Examinees Table', icon: 'table', multi: HealthMulti, gradu: null, binary: null },
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
