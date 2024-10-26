import React from 'react'
import { List, Collapse, Button, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { AnalysisQuest } from '../analysis/types'
import type { UploadQuest } from './UploadQuest'
import type { QuestChild } from '../../../../application/responses/createQuestResponse'
import { useSettings } from '../../context/useSettings'

const { Text } = Typography

type QuestItemProps = {
  item: UploadQuest
  onDelete(uuid: string): void
  onAddAnalysis(quest: AnalysisQuest): void
}

const UploadItem: React.FC<QuestItemProps> = ({ item, onDelete, onAddAnalysis }) => {
  const { fontSize } = useSettings()
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
                <Text strong className='text-base' style={{ fontSize }}>
                  {item.name}
                </Text>
              </div>
            ),
            extra: (
              <Button
                type='text'
                icon={<DeleteOutlined />}
                onClick={() => {
                  onDelete(item.uuid)
                }}
              />
            ),
            children: (
              <List
                dataSource={item.quests}
                renderItem={(quest, index) => (
                  <List.Item key={`${item.name}-${index}`} className='py-2'>
                    <Button
                      type='link'
                      onClick={async () => addAnalysis(quest)}
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

export default UploadItem
