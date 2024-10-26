import React from 'react'
import { List, Collapse, Button, Typography } from 'antd'
import type { ExampleQuest } from './ExampleQuest'
import type { AnalysisQuest } from '../analysis/types'
import { Client } from '../../../Client'
import { useSettings } from '../../context/useSettings'

const { Text } = Typography

type QuestItemProps = {
  item: ExampleQuest
  onAddAnalysis(quest: AnalysisQuest): void
}

const ExampleItem: React.FC<QuestItemProps> = ({ item, onAddAnalysis }) => {
  const { fontSize } = useSettings()
  const addAnalysis = async (scale: number) => {
    const quest = await Client.createQuestfromMetadata(item)
    if (quest.error) {
      console.error(quest.error)
      return
    }
    if (quest.childs) {
      const child = quest.childs.find(q => q.scale === scale)
      if (child) {
        onAddAnalysis({ uuid: child.uuid, scale: child.scale, name: item.name, type: child.type })
      }
    }
  }
  return (
    <List.Item className='border-b border-gray-200 last:border-b-0'>
      <Collapse
        className='w-full'
        items={[
          {
            key: item.name,
            label: (
              <div className='flex items-center justify-between w-full'>
                <Text strong className='text-base' style={{ fontSize }}>
                  {item.name}
                </Text>
              </div>
            ),
            children: (
              <List
                dataSource={item.quests}
                renderItem={(quest, index) => (
                  <List.Item key={`${item.name}-${index}`} className='py-2'>
                    <Button
                      type='link'
                      onClick={async () => addAnalysis(quest.scale)}
                      className='text-left w-full'
                      style={{ fontSize }}
                    >
                      {`Scale: ${quest.scale} | Type: ${quest.type} | Users: ${quest.users} | Items: ${quest.items}`}
                    </Button>
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </List.Item>
  )
}

export default ExampleItem
