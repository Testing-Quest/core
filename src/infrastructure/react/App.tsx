import styles from './App.module.css'
import React, { useState } from 'react'
import { Layout, Tabs, Button } from 'antd'
import { FileTextOutlined, CloseOutlined } from '@ant-design/icons'
import ExampleQuestsTab from './tabs/examples/ExampleQuestsTab'
import UploadQuestsTab from './tabs/upload/UploadQuestsTab'
import AnalysisTab from './tabs/analysis/AnalysisTab'
import type { AnalysisQuest } from './types/AnalysisQuest'

const { Content } = Layout
const { TabPane } = Tabs

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

  return (
    <Layout className={styles.appLayout}>
      <Content className={styles.appContent}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          type='editable-card'
          onEdit={onEdit}
          hideAdd
          className={styles.tabsContainer}
        >
          <TabPane tab='Upload' key='2' className={styles.tabPane} closable={false}>
            <UploadQuestsTab addAnalysisQuest={addAnalysisQuest} />
          </TabPane>
          <TabPane tab='Examples' key='1' className={styles.tabPane} closable={false}>
            <ExampleQuestsTab addAnalysisQuest={addAnalysisQuest} />
          </TabPane>
          {dynamicTabs.map(tab => (
            <TabPane
              tab={
                <span className={styles.dynamicTab}>
                  <FileTextOutlined className={styles.tabIcon} />
                  {`${tab.name} - scale: ${tab.scale}`}
                  <Button
                    type='text'
                    icon={<CloseOutlined />}
                    size='small'
                    className={styles.closeButton}
                    onClick={e => {
                      e.stopPropagation()
                      removeTab(tab.uuid)
                    }}
                  />
                </span>
              }
              key={tab.uuid}
              closable={false}
              className={styles.tabPane}
            >
              <AnalysisTab tabName={`${tab.name}-Scale${tab.scale}`} />
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  )
}
