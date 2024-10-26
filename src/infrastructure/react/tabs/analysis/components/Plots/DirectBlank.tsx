import React, { useCallback, useEffect, useState, useMemo } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Label,
  Scatter,
  ZAxis,
  LabelList,
} from 'recharts'
import type { Client } from '../../../../../Client'
import { Spin, Input, GetProps } from 'antd'
import spinnerStyles from '../../../../App.module.css'
import { Text } from 'recharts'
import { getCorrelation } from './getCorrelation'
import { CustomizedLabel } from './CustomizedLabel'
import { useSettings } from '../../../../context/useSettings'

const { Search } = Input

type PanelProps = {
  client: Client
}

type DataPoint = {
  x: number
  y: number
  hover: number
}

type SearchProps = GetProps<typeof Input.Search>

export const DirectBlank: React.FC<PanelProps> = ({ client }) => {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const { fontSize } = useSettings()
  const [highlightedUser, setHighlightedUser] = useState<number | null>(null)

  const fetchHealth = useCallback(async () => {
    try {
      const response = await client.getDirectBlankData()
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

  const onSearch: SearchProps['onSearch'] = value => {
    const userId = parseInt(value)
    if (!isNaN(userId)) {
      setHighlightedUser(userId)
    }
  }

  const highlightedData = useMemo(() => {
    return data.filter(item => item.hover === highlightedUser)
  }, [data, highlightedUser])

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading health data...' size='large' />
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Search
          placeholder='Examinee ID'
          onSearch={onSearch}
          onClear={() => setHighlightedUser(null)}
          allowClear
          style={{ width: '160px', marginRight: '10px' }}
        />
      </div>
      <div style={{ height: '600px', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
        <ResponsiveContainer width='90%' height={500}>
          <ScatterChart margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
            <XAxis type='number' dataKey='x' name='X' domain={['auto', 'auto']}>
              <Label value='Direct Score' position='insideBottom' offset={-8} fontSize={fontSize} fill='' />
              <Text />
            </XAxis>
            <YAxis type='number' dataKey='y' name='Y'>
              <Label value='Blank Answer' angle={-90} position='insideLeft' offset={8} fontSize={fontSize} fill='' />
            </YAxis>
            <ZAxis type='number' range={[80, 80]} />
            <Scatter name='Users' data={data} isAnimationActive={false} fill='#8884d8' />
            <Scatter name='Highlighted User' data={highlightedData} fill='#4f4f4f' shape='circle' legendType='none'>
              <LabelList dataKey='hover' position='top' content={<CustomizedLabel />} />
            </Scatter>
            <Tooltip content={<CustomTooltip />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p>Correlation: {getCorrelation(data)}</p>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload?.length) {
    const point = payload[0].payload as DataPoint
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Examinee: ${point.hover}`}</p>
        <p>{`Blank: ${point.y.toFixed(2)}`}</p>
        <p>{`Direct: ${point.x.toFixed(2)}`}</p>
      </div>
    )
  }
  return null
}
