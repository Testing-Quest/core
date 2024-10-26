import React, { useEffect, useState, useCallback } from 'react'
import { Spin, Typography, Row, Col, Card } from 'antd'
import type { Client } from '../../../../../Client'
import type { GetHealthResponse } from '../../../../../../application/responses/getHealthResponse'
import spinnerStyles from '../../../../App.module.css'
import styles from '../Components.module.css'
import { PERCENTAGE_PROPERTIES, PROPERTY_MAP, PIE_CHART_PROPERTY_MAP } from './constants'
import HealthChart from './Chart'
import AttractiveTable from './AttractiveTable'
import KeyTable from './KeyTable'
import { useSettings } from '../../../../context/useSettings'

const { Text } = Typography

type PanelProps = {
  client: Client
}

export const Health: React.FC<PanelProps> = ({ client }) => {
  const [health, setHealth] = useState<GetHealthResponse | null>(null)
  const [frequencies, setFrequencies] = useState<Record<string, number> | null>(null)
  const [keys, setKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { fontSize } = useSettings()
  const properties = PROPERTY_MAP[client.getQuestType()]
  const chartProperties = PIE_CHART_PROPERTY_MAP[client.getQuestType()]

  const fetchHealth = useCallback(async () => {
    try {
      const response = await client.getHealthData()
      const frequencyData = await client.getFrequencyData()
      const keys = await client.getModifications()
      setHealth(response)
      setFrequencies(frequencyData)
      setKeys(keys.response?.keys ?? [])
    } catch (error) {
      console.error('Error fetching health data:', error)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  const roundToDecimalPlaces = useCallback((value: number, isPercentage: boolean) => {
    const multiplier = isPercentage ? 100 : 1
    const factor = Math.pow(10, 2)
    return Math.round(value * multiplier * factor) / factor
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
      if (health?.data?.[property] !== undefined) {
        const value =
          typeof health.data[property] === 'number'
            ? formatValue(health.data[property], property)
            : health.data[property]
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

  if (loading || !health) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading health data...' size='large' />
      </div>
    )
  }

  if (!health.data) {
    return (
      <div className={styles.healthPanel} style={{ fontSize }}>
        <Text type='danger'>No health data available</Text>
      </div>
    )
  }

  return (
    <Card className={styles.healthPanel} style={{ fontSize, minHeight: '700px' }}>
      <Row gutter={[16, 16]} className={styles.propertiesRow}>
        {Object.entries(properties).map(([property, displayName]) => renderHealthProperty(property, displayName))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Health Problems</div>}>
            <HealthChart data={health.data} propertyMap={chartProperties} fontSize={fontSize} />
          </Card>
        </Col>
        {(client.getQuestType() === 'multi' || client.getQuestType() === 'binary') && (
          <Col span={12}>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Card
                  title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Attractive</div>}
                  styles={{ header: { backgroundColor: '#f0f2f5' } }}
                >
                  {frequencies && <AttractiveTable data={frequencies} fontSize={fontSize} />}
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Key</div>}
                  styles={{ header: { backgroundColor: '#f0f2f5' } }}
                >
                  <KeyTable keys={keys} fontSize={fontSize} />
                </Card>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Card>
  )
}

export default Health
