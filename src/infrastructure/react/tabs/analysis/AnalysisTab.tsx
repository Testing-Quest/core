import React, { useCallback, useMemo, useState } from 'react'
import { Layout, Card } from 'antd'
import { Client } from '../../../Client'
import { VisualizationProvider } from './context/VisualizationContext'
import VisualizationRenderer from './context/VisualizationRenderer'
import type { AnalysisVisualization, AnalysisQuest } from './types'
import { Sidebar } from './Sidebar'
import styles from './AnalysisTab.module.css'
import DeactivatedList from './DeactivatedList'
import { analysisVisualizations } from './visualizationConfig'

const { Content } = Layout

type AnalysisTabProps = {
  quest: AnalysisQuest
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ quest }) => {
  const client = useMemo(() => new Client(quest), [quest]) // Stabilize client object
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
