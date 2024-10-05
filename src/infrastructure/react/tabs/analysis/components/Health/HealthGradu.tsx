import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import type { Client } from '../../../../../Client'
import type { GetHealthResponse } from '../../../../../../application/responses/getHealthResponse'
import styles from '../../../../App.module.css'

type PanelProps = {
  client: Client
}

export const HealthGradu: React.FC<PanelProps> = ({ client }) => {
  const [health, setHealth] = useState<GetHealthResponse | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className='health-multi-panel'>
      <div className='health-multi-section'>
        <h3>Descriptive Statistics</h3>
        {loading ? (
          <div className={styles.loading}>
            <Spin tip='Loading health data...' size='large' />
          </div>
        ) : (
          <div>
            {health?.health ? <pre>{JSON.stringify(health.health, null, 2)}</pre> : <p>No health data available.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
