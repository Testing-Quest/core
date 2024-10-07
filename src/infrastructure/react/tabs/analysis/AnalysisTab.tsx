import React, { useCallback, useState } from 'react'
import { Layout, Card } from 'antd'
import { Client } from '../../../Client'
import { Health } from './components/Health'
import { VisualizationProvider } from './context/VisualizationContext'
import VisualizationRenderer from './context/VisualizationRenderer'
import type { AnalysisVisualization, AnalysisQuest } from './types'
import Sidebar from './Sidebar'
import styles from './AnalysisTab.module.css'
import DeactivatedList from './DeactivatedList'
import { Reliability } from './components/Plots/Reliability'
import { ItemsMap } from './components/Plots/ItemsMap'
import { DirectWeight } from './components/Plots/DirectWeight'
import { DirectBlank } from './components/Plots/DirectBlank'
import { DirectMci } from './components/Plots/DirectMci'
import { DirectCoherency } from './components/Plots/DirectCoherency'
import { ScoreDistribution } from './components/Plots/ScoreDistribution'
import { ExamineeTable } from './components/Tables/ExamineeTable'
import { ItemsTable } from './components/Tables/ItemsTable'

const { Content } = Layout

type AnalysisTabProps = {
  quest: AnalysisQuest
}

export const analysisVisualizations: AnalysisVisualization[] = [
  { label: 'Health', icon: 'basic', multi: Health, gradu: Health, binary: Health },
  { label: 'Reliability', icon: 'plot', multi: Reliability, gradu: Reliability, binary: Reliability },
  { label: 'Items Map', icon: 'plot', multi: ItemsMap, gradu: ItemsMap, binary: ItemsMap },
  { label: 'Direct Weighted', icon: 'plot', multi: DirectWeight, gradu: null, binary: DirectWeight },
  { label: 'Direct Blank', icon: 'plot', multi: DirectBlank, gradu: DirectBlank, binary: DirectBlank },
  { label: 'Direct Coherency', icon: 'plot', multi: DirectCoherency, gradu: null, binary: DirectCoherency },
  { label: 'Direct MCI', icon: 'plot', multi: DirectMci, gradu: null, binary: DirectMci },
  {
    label: 'Score Distribution',
    icon: 'plot',
    multi: ScoreDistribution,
    gradu: ScoreDistribution,
    binary: ScoreDistribution,
  },
  { label: 'Items Table', icon: 'table', multi: ItemsTable, gradu: ItemsTable, binary: ItemsTable },
  { label: 'Examinees Table', icon: 'table', multi: ExamineeTable, gradu: ExamineeTable, binary: ExamineeTable },
]

const AnalysisTab: React.FC<AnalysisTabProps> = ({ quest }) => {
  const client = new Client(quest)
  const questType = client.getQuestType()

  const questVisualizations = analysisVisualizations.filter(visualization => {
    return visualization[questType as keyof AnalysisVisualization] !== null
  })

  const [deactivatedItems, setDeactivatedItems] = useState<number[]>([])
  const [deactivatedExaminees, setDeactivatedExaminees] = useState<number[]>([])
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const clearDeactivatedItems = useCallback(async () => {
    const modifications = await client.getModifications()
    if (modifications.error) {
      return
    }
    const items = Array.from(modifications.response!.items).fill(true)
    await client.updateQuest({ keys: null, activeItems: items, activeUsers: null })
    setDeactivatedItems([])
    setUpdateTrigger(prev => prev + 1) // Forzar actualización
  }, [client])

  const clearDeactivatedExaminees = useCallback(async () => {
    const modifications = await client.getModifications()
    if (modifications.error) {
      return
    }
    const examinees = Array.from(modifications.response!.users).fill(true)
    await client.updateQuest({ keys: null, activeItems: null, activeUsers: examinees })
    setDeactivatedExaminees([])
    setUpdateTrigger(prev => prev + 1) // Forzar actualización
  }, [client])

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
                updateTrigger={updateTrigger} // Nuevo prop
              />
            </div>
          </Card>
        </Content>
      </Layout>
    </VisualizationProvider>
  )
}

export default AnalysisTab
