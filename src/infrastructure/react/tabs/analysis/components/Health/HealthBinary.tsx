import React, { useEffect, useState } from 'react'
import { Spin, Typography, Row, Col } from 'antd'
import type { Client } from '../../../../../Client'
import type { GetHealthResponse } from '../../../../../../application/responses/getHealthResponse'
import spinnerStyles from '../../../../App.module.css'
import styles from '../Components.module.css'
import { useSettings } from '../../../../context/SettingContext'

const { Text } = Typography

const BINARY_QUEST_PROPERTIES = [
  'cronbachAlpha',
  'sem',
  'mean',
  'variance',
  'standardDeviation',
  'reliability',
  'discrimination',
  'testHealth',
  'coherency',
  'difficulty',
]

type PanelProps = {
  client: Client
}

const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100

export const HealthBinary: React.FC<PanelProps> = ({ client }) => {
  const [health, setHealth] = useState<GetHealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { fontSize } = useSettings()

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await client.getHealth()
        setHealth(response)
      } catch (error) {
        console.error('Error fetching health data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHealth()
  }, [client])

  const renderHealthProperty = (property: string) => {
    if (health?.health?.[property] !== undefined) {
      const value =
        typeof health.health[property] === 'number'
          ? roundToTwoDecimals(health.health[property])
          : health.health[property]

      return (
        <Col span={12} key={property}>
          <Text strong>{property}:</Text> <Text>{value}</Text>
        </Col>
      )
    }
    return null
  }

  return (
    <div className={styles.healthBinaryPanel} style={{ fontSize }}>
        {loading ? (
          <div className={spinnerStyles.loading}>
            <Spin tip='Loading health data...' size='large' />
          </div>
        ) : health?.health ? (
          <Row gutter={[16, 16]}>{BINARY_QUEST_PROPERTIES.map(renderHealthProperty)}</Row>
        ) : (
          <Text>No health data available.</Text>
        )}
    </div>
  )
}

export default HealthBinary
