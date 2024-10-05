import React, { useState } from 'react'
import { Layout, Card } from 'antd'
import { Client } from '../../../Client'
import { Health } from './components/Health'
import { VisualizationProvider } from './context/VisualizationContext'
import VisualizationRenderer from './context/VisualizationRenderer'
import type { AnalysisVisualization, AnalysisQuest } from './types'
import Sidebar from './Sidebar'
import styles from './AnalysisTab.module.css'
import DeactivatedList from './DeactivatedList'
import { Reliability } from './components/DirectGraphs/Reliability'

const { Content } = Layout

type AnalysisTabProps = {
  quest: AnalysisQuest
}

export const analysisVisualizations: AnalysisVisualization[] = [
  { label: 'Health', icon: 'basic', multi: Health, gradu: Health, binary: Health },
  { label: 'Reliability', icon: 'plot', multi: Reliability, gradu: Reliability, binary: Reliability },
  { label: 'Items Map', icon: 'plot', multi: Health, gradu: null, binary: null },
  { label: 'Direct Weighted', icon: 'plot', multi: Health, gradu: null, binary: null },
  { label: 'Direct Blank', icon: 'plot', multi: Health, gradu: null, binary: null },
  { label: 'Direct Coherency', icon: 'plot', multi: Health, gradu: null, binary: null },
  { label: 'Direct MCI', icon: 'plot', multi: Health, gradu: null, binary: null },
  { label: 'Score Distribution', icon: 'plot', multi: Health, gradu: null, binary: null },
  { label: 'Items Table', icon: 'table', multi: Health, gradu: null, binary: null },
  { label: 'Examinees Table', icon: 'table', multi: Health, gradu: null, binary: null },
]

const AnalysisTab: React.FC<AnalysisTabProps> = ({ quest }) => {
  const client = new Client(quest)
  const questType = client.getQuestType()

  const questVisualizations = analysisVisualizations.filter(visualization => {
    return visualization[questType as keyof AnalysisVisualization] !== null
  })

  const [deactivatedItems, setDeactivatedItems] = useState<number[]>([])
  const [deactivatedExaminees, setDeactivatedExaminees] = useState<number[]>(
    Array.from({ length: 25 }, (_, i) => i + 1),
  )

  const clearDeactivatedItems = () => {
    setDeactivatedItems([])
  }
  const clearDeactivatedExaminees = () => {
    setDeactivatedExaminees([])
  }

  if (questVisualizations.length === 0) {
    return <div>No hay visualizaciones disponibles para este tipo de quest.</div>
  }

  return (
    <VisualizationProvider initialVisualization={questVisualizations[0]}>
      <Layout className={styles.layout}>
        <Layout.Sider width='14.7%' className={styles.sider}>
          <Sidebar visualizations={questVisualizations} />
        </Layout.Sider>
        <Content className={styles.content}>
          <div className={styles.deactivatedListContainer}>
            <DeactivatedList items={deactivatedItems} title='Deactivated Items' onClear={clearDeactivatedItems} />
            <div style={{ marginLeft: 8 }} />
            <DeactivatedList
              items={deactivatedExaminees}
              title='Deactivated Examinees'
              onClear={clearDeactivatedExaminees}
            />
          </div>
          <Card className={styles.visualizationCard}>
            <div className={styles.visualizationContent}>
              <VisualizationRenderer
                client={client}
                setDeactivatedItems={setDeactivatedItems}
                setDeactivatedExaminees={setDeactivatedExaminees}
              />
            </div>
          </Card>
        </Content>
      </Layout>
    </VisualizationProvider>
  )
}

export default AnalysisTab
