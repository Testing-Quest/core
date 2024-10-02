import React from 'react'
import { List, Collapse, Button, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { AnalysisQuest } from '../../types/AnalysisQuest'
import type { UploadQuest } from './UploadQuest'
import type { QuestChild } from '../../../../application/responses/createQuestResponse'

const { Text } = Typography

type QuestItemProps = {
  item: UploadQuest
  onDelete(): void
  onAddAnalysis(quest: AnalysisQuest): void
  showDeleteButton: boolean
}

const UploadItem: React.FC<QuestItemProps> = ({ item, onDelete, onAddAnalysis, showDeleteButton }) => {
  const addAnalysis = async (child: QuestChild) => {
    onAddAnalysis({ uuid: child.uuid, scale: child.scale, name: item.name, type: child.type })
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
                    <Button type='link' onClick={async () => addAnalysis(quest)} className='text-left w-full'>
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

export default UploadItem
