import React, { useCallback, useEffect, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from 'recharts'
import type { Client } from '../../../../../Client'
import { Spin } from 'antd'
import spinnerStyles from '../../../../App.module.css'
import { Text } from 'recharts'
import { BarChart } from 'recharts'
import { useSettings } from '../../../../context/useSettings'
type PanelProps = {
  client: Client
}

type DataPoint = {
  x: number
  y: number
  hover: number
}

export const ScoreDistribution: React.FC<PanelProps> = ({ client }) => {
  const [data, setData] = useState<{ x: number; y: number }[]>()
  const [loading, setLoading] = useState(true)
  const { fontSize } = useSettings()

  const fetchHealth = useCallback(async () => {
    try {
      const response = await client.getScoreDistribution()
      setData(response.data!)
    } catch (error) {
      console.error('Error fetching health data:', error)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading health data...' size='large' />
      </div>
    )
  }
  return (
    <div style={{ height: '600px', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
      <ResponsiveContainer width='90%' height={500}>
        <BarChart data={data} margin={{ bottom: 15 }}>
          <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
          <XAxis type='number' dataKey='x' name='X' domain={['auto', 'auto']} fontSize={fontSize}>
            <Text />
          </XAxis>
          <YAxis type='number' dataKey='y' name='Y'></YAxis>
          <Bar dataKey='y' fill='#8884d8' />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000000' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload?.length) {
    const point = payload[0].payload as DataPoint
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Score: ${point.x.toFixed(2)}`}</p>
        <p>{`percent: ${point.y.toFixed(2)}%`}</p>
      </div>
    )
  }
  return null
}
