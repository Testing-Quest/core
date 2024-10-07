import React, { useCallback, useEffect, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Label, Scatter } from 'recharts'
import type { Client } from '../../../../../Client'
import { Spin } from 'antd'
import spinnerStyles from '../../../../App.module.css'
import { useSettings } from '../../../../context/SettingContext'
import { Text } from 'recharts'

type PanelProps = {
  client: Client
}

type DataPoint = {
  x: number
  y: number
  hover: number
}

export const DirectMci: React.FC<PanelProps> = ({ client }) => {
  const [data, setData] = useState<{ x: number; y: number }[]>()
  const [loading, setLoading] = useState(true)
  const { fontSize } = useSettings()

  const fetchHealth = useCallback(async () => {
    try {
      const response = await client.getDirectMciData()
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
      {loading ? ( // Mostrar el componente de carga si loading es true
        <Spin size='large' />
      ) : (
        <ResponsiveContainer width='90%' height={500}>
          <ScatterChart margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
            <XAxis type='number' dataKey='x' name='X'>
              <Label value='Direct Score' position='insideBottom' offset={-8} fontSize={fontSize} fill='' />
              <Text />
            </XAxis>
            <YAxis type='number' dataKey='y' name='Y'>
              <Label value='MCI' angle={-90} position='insideLeft' offset={8} fontSize={fontSize} fill='' />
            </YAxis>
            <Scatter name='Items' data={data} isAnimationActive={false} fill='#8884d8' fontSize={fontSize} />
            <Tooltip content={<CustomTooltip />} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload?.length) {
    const point = payload[0].payload as DataPoint
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Examinee: ${point.hover}`}</p>
        <p>{`MCI: ${point.y.toFixed(2)}`}</p>
        <p>{`Direct: ${point.x.toFixed(2)}`}</p>
      </div>
    )
  }

  return null
}
