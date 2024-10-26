import styles from '../../App.module.css'
import React, { useEffect, useState } from 'react'
import { List, Spin, Alert } from 'antd'
import { Client } from '../../../Client'
import type { ExampleQuest } from './ExampleQuest'
import ExampleItem from './ExampleItem'
import type { AnalysisQuest } from '../analysis/types'

type ExampleQuestsTabProps = {
  addAnalysisQuest(quest: AnalysisQuest): void
}

const ExampleQuestsTab: React.FC<ExampleQuestsTabProps> = ({ addAnalysisQuest }) => {
  const [exampleQuests, setExampleQuests] = useState<ExampleQuest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExampleQuests = async () => {
      try {
        const quests = await Client.getMetadata()
        setExampleQuests(quests)
      } catch (err) {
        setError(`Failed to load quests: ${err}`)
      } finally {
        setLoading(false)
      }
    }
    fetchExampleQuests()
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin tip='Loading quests...' size='large' />
      </div>
    )
  }

  if (error) {
    return <Alert message={error} type='error' />
  }

  return (
    <div className={styles.appContent}>
      <List
        dataSource={exampleQuests}
        renderItem={item => <ExampleItem item={item} onAddAnalysis={addAnalysisQuest} />}
      />
    </div>
  )
}

export default ExampleQuestsTab
