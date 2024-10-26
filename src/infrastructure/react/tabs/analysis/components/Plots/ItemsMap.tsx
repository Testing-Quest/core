import React, { useCallback, useEffect, useState, useMemo } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
  ZAxis,
  LabelList,
  ReferenceLine,
  Label,
} from 'recharts'
import type { Client } from '../../../../../Client'
import { Spin, Input, GetProps } from 'antd'
import spinnerStyles from '../../../../App.module.css'
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

export const ItemsMap: React.FC<PanelProps> = ({ client }) => {
  const [data, setData] = useState<DataPoint[]>([])
  const [alternatives, setAlternatives] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const { fontSize } = useSettings()
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null)

  const fetchHealth = useCallback(async () => {
    try {
      const response = await client.getItemMapData()
      const alternatives = await client.getNumberOfAlternatives()
      setData(response.data!)
      setAlternatives(alternatives)
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
    const itemId = parseInt(value)
    if (!isNaN(itemId)) {
      setHighlightedItem(itemId)
    }
  }

  const highlightedData = useMemo(() => {
    return data.filter(item => item.hover === highlightedItem)
  }, [data, highlightedItem])

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading health data...' size='large' />
      </div>
    )
  }

  var y_domain
  var y_ticks

  var x1, x2, x3, x4
  if (client.getQuestType() != 'gradu') {
    y_domain = [0, 1]
    y_ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    x1 = 0.2
    x2 = 0.4
    x3 = 0.6
    x4 = 0.8
  } else {
    const answers = alternatives
    y_domain = [1, answers]
    y_ticks = Array.from({ length: (answers - 1) * 10 }, (_, index) => (1 + index * 0.1).toFixed(1))
    y_ticks.push(answers.toFixed(0))
    x1 = 1 + 0.2 * (answers - 1)
    x2 = 1 + 0.4 * (answers - 1)
    x3 = 1 + 0.6 * (answers - 1)
    x4 = 1 + 0.8 * (answers - 1)
  }

  const ticks = [
    -1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
  ]

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Search
          placeholder='Item ID'
          onSearch={onSearch}
          onClear={() => setHighlightedItem(null)}
          allowClear
          style={{ width: '160px', marginRight: '10px' }}
        />
      </div>
      <div style={{ height: '600px', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
        <ResponsiveContainer width='90%' height={500}>
          <ScatterChart margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
            <XAxis type='number' dataKey='x' name='X' ticks={y_ticks} domain={y_domain}>
              <Label value='Difficulty' position='insideBottom' offset={-8} fontSize={fontSize} fill='' />
              <Text />
            </XAxis>
            <YAxis type='number' ticks={ticks} dataKey='y' name='Y' domain={[-1, 1]}>
              <Label value='Discrimination' angle={-90} position='insideLeft' offset={8} fontSize={fontSize} fill='' />
            </YAxis>
            <ZAxis type='number' range={[80, 80]} />
            {/* COLORES */}
            <rect x={60} y={1} width={'99%'} height={46 * 2.5} fill='green' fillOpacity={0.4} fontSize={fontSize} />
            <rect x={60} y={115} width={'99%'} height={46} fill='yellow' fillOpacity={0.4} fontSize={fontSize} />
            <rect x={60} y={160} width={'99%'} height={23} fill='orange' fillOpacity={0.4} fontSize={fontSize} />
            <rect x={60} y={182} width={'99%'} height={46 * 2} fill='red' fillOpacity={0.4} fontSize={fontSize} />
            <rect x={60} y={272} width={'99%'} height={46 * 4} fill='black' fillOpacity={0.4} fontSize={fontSize} />
            {/* 4 Lineas Horizontales */}
            <ReferenceLine y={0} stroke='black' />
            {/* 4 Lineas Verticales */}
            <ReferenceLine x={x1} stroke='black' />
            <ReferenceLine x={x2} stroke='black' />
            <ReferenceLine x={x3} stroke='black' />
            <ReferenceLine x={x4} stroke='black' />
            {/* Letras Horizontales */}
            <text x='98%' y='74%' style={{ fontSize: fontSize, fill: '#000000' }}>
              4
            </text>
            <text x='98%' y='45%' style={{ fontSize: fontSize, fill: '#000000' }}>
              5
            </text>
            <text x='98%' y='35.4%' style={{ fontSize: fontSize, fill: '#000000' }}>
              3
            </text>
            <text x='98%' y='28.5%' style={{ fontSize: fontSize, fill: '#000000' }}>
              2
            </text>
            <text x='98%' y='15%' style={{ fontSize: fontSize, fill: '#000000' }}>
              1
            </text>
            {/* Letras Verticales */}
            <text x='90%' y='90%' style={{ fontSize: fontSize, fill: '#000000' }}>
              A
            </text>
            <text x='71%' y='90%' style={{ fontSize: fontSize, fill: '#000000' }}>
              B
            </text>
            <text x='51.7%' y='90%' style={{ fontSize: fontSize, fill: '#000000' }}>
              C
            </text>
            <text x='32.6%' y='90%' style={{ fontSize: fontSize, fill: '#000000' }}>
              D
            </text>
            <text x='13.5%' y='90%' style={{ fontSize: fontSize, fill: '#000000' }}>
              E
            </text>
            <Scatter name='Items' data={data} fill='#4f4f4f' />
            <Scatter name='Highlighted Item' data={highlightedData} fill='#8884d8' shape='circle' legendType='none'>
              <LabelList dataKey='hover' position='top' content={<CustomizedLabel color='#8884d8' />} />
            </Scatter>
            <Tooltip content={<CustomTooltip />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload?.length) {
    const point = payload[0].payload as DataPoint
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Item: ${point.hover}`}</p>
        <p>{`Difficulty: ${point.x.toFixed(2)}`}</p>
        <p>{`Discrimination: ${point.y.toFixed(2)}`}</p>
      </div>
    )
  }
  return null
}
