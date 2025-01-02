import styles from './App.module.css'
import React, { useState } from 'react'
import { Layout, Tabs, Button } from 'antd'
import { FileTextOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons'
import ExampleQuestsTab from './tabs/examples/ExampleQuestsTab'
import UploadQuestsTab from './tabs/upload/UploadQuestsTab'
import AnalysisTab from './tabs/analysis/AnalysisTab'
import type { AnalysisQuest } from './tabs/analysis/types'
import SettingsModal from './context/SettingsModal'
import { useSettings } from './context/useSettings'

export const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1')
  const [dynamicTabs, setDynamicTabs] = useState<AnalysisQuest[]>([])
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)
  const { fontSize } = useSettings()

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

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
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
        <span className={styles.dynamicTab} style={{ fontSize: fontSize }}>
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
      children: <AnalysisTab quest={tab} />,
      closable: false,
    })),
  ]

  return (
    <Layout className={styles.appLayout} style={{ fontSize }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        type='editable-card'
        onEdit={onEdit}
        hideAdd
        items={items}
        className={styles.tabs}
        style={{ fontSize: fontSize }}
      />
      <Button
        icon={<SettingOutlined style={{ fontSize: '24px' }} />}
        onClick={() => {
          setIsSettingsModalVisible(true)
        }}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 1000,
          padding: '24px', // Aumentar el padding para un botón más grande
        }}
      />
      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={() => {
          setIsSettingsModalVisible(false)
        }}
      />
    </Layout>
  )
}
