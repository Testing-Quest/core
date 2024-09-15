import React, { useState, useEffect } from 'react'
import type { questGradu } from '../../../domain/quests/questGradu'
import type { questMulti } from '../../../domain/quests/questMulti'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
} from 'recharts'
import { Label } from 'recharts'
import { Spin } from 'antd'

type DataPoint = {
  x: number
  y: number
  hover: number
}

type PanelProps = {
  quest: questGradu | questMulti
}

export const DirectVsBlank: React.FC<PanelProps> = ({ quest }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    const items_map = quest.directVsBlankAnswer()

    const x = items_map.getX()
    const y = items_map.getY()
    const hover = items_map.getHoverInfo()

    const newData: DataPoint[] = x.map((value, index) => ({
      x: value,
      y: y[index],
      hover: hover[index],
    }))

    setTimeout(() => {
      setData(newData)
      setLoading(false)
    }, 1)
  }, [quest])

  return (
    <div
      style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '50px',
      }}
    >
      {loading ? (
        <Spin size='large' />
      ) : (
        <ResponsiveContainer width='90%' height={500}>
          <ScatterChart margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
            <XAxis type='number' dataKey='x' name='X'>
              <Label
                value='Direct Score'
                position='insideBottom'
                offset={-8}
                fontSize={18}
                fill=''
              />
              <Text />
            </XAxis>
            <YAxis type='number' dataKey='y' name='Y'>
              <Label
                value='Blank Answer'
                angle={-90}
                position='insideLeft'
                offset={8}
                fontSize={18}
                fill=''
              />
            </YAxis>
            <Scatter
              name='Items'
              data={data}
              isAnimationActive={false}
              fill='#8884d8'
            />
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
      <div
        style={{
          backgroundColor: 'white',
          padding: '5px',
          border: '1px solid #ccc',
        }}
      >
        <p>{`Examinee: ${point.hover}`}</p>
        <p>{`Weighted: ${point.y.toFixed(2)}`}</p>
        <p>{`Direct: ${point.x.toFixed(2)}`}</p>
      </div>
    )
  }

  return null
}
