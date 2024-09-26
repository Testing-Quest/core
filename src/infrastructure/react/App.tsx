import React, { useState } from 'react'
import { Layout, Tabs } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
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
    if (!dynamicTabs.includes(quest)) {
      setDynamicTabs([...dynamicTabs, quest])
    }
    setActiveKey(quest.uuid)
  }

  return (
    <Layout className='min-h-screen bg-gray-100'>
      <Content className='p-4'>
        <Tabs activeKey={activeKey} onChange={setActiveKey} type='card' className='bg-white h-full'>
          <TabPane tab='Upload' key='2'>
            <UploadQuestsTab addAnalysisQuest={addAnalysisQuest} />
          </TabPane>
          <TabPane tab='Examples' key='1'>
            <ExampleQuestsTab addAnalysisQuest={addAnalysisQuest} />
          </TabPane>
          {dynamicTabs.map(tab => (
            <TabPane
              tab={
                <span>
                  <FileTextOutlined className='mr-2' />
                  {tab.name}
                </span>
              }
              key={tab.uuid}
              closable={true}
            >
              <AnalysisTab tabName={`${tab.name}-Scale${tab.scale}`} />
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  )
}
