import React from 'react'
import { List, Collapse, Button, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { ExampleQuest } from './ExampleQuest'
import type { AnalysisQuest } from '../../types/AnalysisQuest'
import { Client } from '../../../Client'

const { Text } = Typography

type QuestItemProps = {
  item: ExampleQuest
  onDelete(): void
  onAddAnalysis(quest: AnalysisQuest): void
  showDeleteButton: boolean
}

const ExampleItem: React.FC<QuestItemProps> = ({ item, onDelete, onAddAnalysis, showDeleteButton }) => {
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
                <Text strong className='text-base'>
                  {item.name}
                </Text>
                {showDeleteButton && (
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={e => {
                      e.stopPropagation()
                      onDelete()
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ),
            children: (
              <List
                dataSource={item.quests}
                renderItem={(quest, index) => (
                  <List.Item key={`${item.name}-${index}`} className='py-2'>
                    <Button type='link' onClick={async () => addAnalysis(quest.scale)} className='text-left w-full'>
                      <Text className='text-sm'>
                        {`Scale: ${quest.scale} | Type: ${quest.type} | Users: ${quest.users} | Items: ${quest.items}`}
                      </Text>
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
