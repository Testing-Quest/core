import React from 'react'
import { questGradu } from '../../../domain/quests/questGradu'
import { questMulti } from '../../../domain/quests/questMulti'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  x: number
  y: number
}

interface PanelProps {
  quest: questGradu | questMulti
}

export const Reliability: React.FC<PanelProps> = ({ quest }) => {
  const reliability = quest.calculateReliability()

  const x = reliability.getX()
  const y = reliability.getY()

  const data: DataPoint[] = x.map((value, index) => ({
    x: value,
    y: y[index],
  }))

  const handleClick = (point: any) => {
    if (point && point.activePayload && point.activePayload.length > 0) {
      const clickedPoint = point.activePayload[0].payload
      console.log(
        `Clicked point - x: ${clickedPoint.x.toFixed(2)}, y: ${clickedPoint.y.toFixed(2)}`,
      )
    }
  }

  return (
    <div
      style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '50px',
      }}
    >
      <ResponsiveContainer width='90%' height={500}>
        <LineChart data={data} onClick={handleClick} margin={{ bottom: 15 }}>
          <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
          <XAxis
            dataKey='x'
            type='number'
            tickCount={11}
            domain={[0.5, 1.5]}
            label={{
              fontSize: 18,
              value: 'Test length ',
              position: 'insideBottom',
              fill: '',
              offset: -8,
            }}
          />
          <YAxis
            domain={[0, 1]}
            tickCount={11}
            label={{
              fontSize: 18,
              value: 'Reliability',
              angle: -90,
              position: 'insideLeft',
              offset: 8,
              fill: '',
            }}
          />
          <Tooltip
            labelFormatter={(label: any) => `Length: ${label.toFixed(1)}`}
            formatter={(value: any) => [`${value.toFixed(2)}`, 'Reliability']}
            labelStyle={{ color: 'black' }}
            itemStyle={{ color: 'black' }}
          />
          <Line
            type='monotone'
            dataKey='y'
            isAnimationActive={false}
            stroke='#8884d8'
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          <rect
            x={60}
            y={90}
            width={'99%'}
            height={46}
            fill='green'
            fillOpacity={0.3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
