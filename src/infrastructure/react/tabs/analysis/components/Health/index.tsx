import React, { useEffect, useState, useCallback } from 'react'
import { Spin, Typography, Row, Col, Button } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import type { Client } from '../../../../../Client'
import type { GetHealthResponse } from '../../../../../../application/responses/getHealthResponse'
import spinnerStyles from '../../../../App.module.css'
import styles from '../Components.module.css'
import { useSettings } from '../../../../context/SettingContext'
import { PERCENTAGE_PROPERTIES, PROPERTY_MAP } from './constants'

const { Text } = Typography

type PanelProps = {
  client: Client
}

export const Health: React.FC<PanelProps> = ({ client }) => {
  const [health, setHealth] = useState<GetHealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const { fontSize } = useSettings()

  const properties = PROPERTY_MAP[client.getQuestType()]

  const fetchHealth = useCallback(async () => {
    try {
      const response = await client.getHealth()
      setHealth(response)
    } catch (error) {
      console.error('Error fetching health data:', error)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  const roundToDecimalPlaces = useCallback(
    (value: number, isPercentage: boolean) => {
      const multiplier = isPercentage ? 100 : 1
      const factor = Math.pow(10, decimalPlaces)
      return Math.round(value * multiplier * factor) / factor
    },
    [decimalPlaces],
  )

  const handleDecimalChange = useCallback((increment: number) => {
    setDecimalPlaces(prevPlaces => Math.max(2, Math.min(13, prevPlaces + increment)))
  }, [])

  const formatValue = useCallback(
    (value: number, property: string) => {
      const isPercentage = PERCENTAGE_PROPERTIES.includes(property)
      const roundedValue = roundToDecimalPlaces(value, isPercentage)
      return isPercentage ? `${roundedValue}%` : roundedValue
    },
    [roundToDecimalPlaces],
  )

  const renderHealthProperty = useCallback(
    (property: string, displayName: string) => {
      if (health?.health?.[property] !== undefined) {
        const value =
          typeof health.health[property] === 'number'
            ? formatValue(health.health[property], property)
            : health.health[property]

        return (
          <Col xs={24} sm={12} md={8} key={property} className={styles.propertyCol}>
            <Text strong style={{ fontSize }}>
              {displayName}:
            </Text>{' '}
            <Text style={{ fontSize }}>{value}</Text>
          </Col>
        )
      }
      return null
    },
    [health, formatValue, fontSize],
  )

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading health data...' size='large' />
      </div>
    )
  }

  return (
    <div className={styles.healthBinaryPanel} style={{ fontSize }}>
      <div className={styles.decimalControl}>
        <Text>Decimals:</Text>
        <Button
          icon={<MinusOutlined />}
          onClick={() => {
            handleDecimalChange(-1)
          }}
          disabled={decimalPlaces === 2}
          size='small'
        />
        <Text>{decimalPlaces}</Text>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            handleDecimalChange(1)
          }}
          size='small'
        />
      </div>
      <Row gutter={[16, 16]} className={styles.propertiesRow}>
        {Object.entries(properties).map(([property, displayName]) => renderHealthProperty(property, displayName))}
      </Row>
    </div>
  )
}

export default Health
