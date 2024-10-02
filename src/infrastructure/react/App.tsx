import styles from './App.module.css'
import React, { useState } from 'react'
import { Layout, Tabs, Button } from 'antd'
import { FileTextOutlined, CloseOutlined } from '@ant-design/icons'
import ExampleQuestsTab from './tabs/examples/ExampleQuestsTab'
import UploadQuestsTab from './tabs/upload/UploadQuestsTab'
import AnalysisTab from './tabs/analysis/AnalysisTab'
import type { AnalysisQuest } from './types/AnalysisQuest'

export const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1')
  const [dynamicTabs, setDynamicTabs] = useState<AnalysisQuest[]>([])

  const addAnalysisQuest = (quest: AnalysisQuest) => {
    if (!dynamicTabs.find(tab => tab.uuid === quest.uuid)) {
      setDynamicTabs([...dynamicTabs, quest])
    }
    setActiveKey(quest.uuid)
  }

  const removeTab = (targetKey: string) => {
    const newTabs = dynamicTabs.filter(tab => tab.uuid !== targetKey)
    setDynamicTabs(newTabs)
    if (newTabs.length && activeKey === targetKey) {
      setActiveKey(newTabs[newTabs.length - 1].uuid)
    } else if (!newTabs.length) {
      setActiveKey('1')
    }
  }

  const onEdit = (targetKey: any, action: 'add' | 'remove') => {
    if (action === 'remove' && typeof targetKey === 'string') {
      removeTab(targetKey)
    }
  }

  const items = [
    {
      key: '2',
      label: 'Upload',
      children: <UploadQuestsTab addAnalysisQuest={addAnalysisQuest} />,
      closable: false,
    },
    {
      key: '1',
      label: 'Examples',
      children: <ExampleQuestsTab addAnalysisQuest={addAnalysisQuest} />,
      closable: false,
    },
    ...dynamicTabs.map(tab => ({
      key: tab.uuid,
      label: (
        <span className={styles.dynamicTab}>
          <FileTextOutlined className={styles.tabIcon} />
          {`${tab.name} - scale: ${tab.scale}`}
          <Button
            type='text'
            icon={<CloseOutlined />}
            size='small'
            test-id='close-button'
            className={styles.closeButton}
            onClick={e => {
              e.stopPropagation()
              removeTab(tab.uuid)
            }}
          />
        </span>
      ),
      children: <AnalysisTab tabName={`${tab.name}-Scale${tab.scale}`} />,
      closable: false,
    })),
  ]

  return (
    <Layout className={styles.appLayout}>
      <Tabs activeKey={activeKey} onChange={setActiveKey} type='editable-card' onEdit={onEdit} hideAdd items={items} />
    </Layout>
  )
}
