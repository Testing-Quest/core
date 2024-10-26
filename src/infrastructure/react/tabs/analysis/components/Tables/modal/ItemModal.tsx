import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Button, Space } from 'antd'
import { Client } from '../../../../../../Client'
import { DiscriminationComponent } from './DiscriminationComponent'
import { FrequencyComponent } from './FrequencyComponent'
import { ProfileComponent } from './ProfileComponent'

type ItemModalProps = {
  visible: boolean
  onClose(): void
  itemId: number | null
  client: Client
}

export const ItemModal: React.FC<ItemModalProps> = ({ visible, onClose, itemId, client }) => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null)
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [componentData, setComponentData] = useState<any>(null)

  const fetchData = useCallback(
    async (dataType: string) => {
      if (itemId === null) return
      try {
        let data
        switch (dataType) {
          case 'discrimination':
            data = await client.getItemDiscriminationData(itemId - 1)
            break
          case 'frequency':
            data = await client.getItemFrequencyData(itemId - 1)
            break
          case 'profile':
            data = await client.getItemProfileData(itemId - 1)
            break
          default:
            throw new Error('Invalid data type')
        }
        setComponentData(data)
        setActiveComponent(dataType)
      } catch (error) {
        console.error(`Error fetching ${dataType} data:`, error)
      }
    },
    [itemId, client],
  )

  useEffect(() => {
    fetchData('frequency')
  }, [visible, itemId, client, fetchData])

  const renderComponent = () => {
    switch (activeComponent) {
      case 'discrimination':
        return <DiscriminationComponent data={componentData} />
      case 'frequency':
        return <FrequencyComponent data={componentData} />
      case 'profile':
        return <ProfileComponent data={componentData} />
      default:
        return null
    }
  }

  const close = () => {
    setActiveComponent(null)
    setComponentData(null)
    onClose()
  }

  return (
    <Modal title={`Item Details - ID: ${itemId}`} open={visible} onCancel={close} width={800} footer={null}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchData('frequency')} type={activeComponent === 'frequency' ? 'primary' : 'default'}>
          Frequency
        </Button>
        {(client.getQuestType() === 'multi' || client.getQuestType() === 'binary') && (
          <Button
            onClick={() => fetchData('discrimination')}
            type={activeComponent === 'discrimination' ? 'primary' : 'default'}
          >
            Discrimination
          </Button>
        )}
        <Button onClick={() => fetchData('profile')} type={activeComponent === 'profile' ? 'primary' : 'default'}>
          Profile
        </Button>
      </Space>
      {renderComponent()}
    </Modal>
  )
}
