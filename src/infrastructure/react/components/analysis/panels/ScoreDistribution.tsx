import React from 'react'
import type { questMulti } from '../../../domain/quests/questMulti'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
  Bar,
} from 'recharts'
import type { questGradu } from '../../../domain/quests/questGradu'
import { BarChart } from 'recharts'

type DataPoint = {
  x: number
  y: number
  hover: number
}

type PanelProps = {
  quest: questMulti | questGradu
}

export const ScoreDistribution: React.FC<PanelProps> = ({ quest }) => {
  const items_map = quest.scoreDistribution()

  const score = items_map.getX()

  // we need to do an histogram, so we need to create bins, in total need to be 15 bins

  const min = Math.min(...score)
  const max = Math.max(...score)
  const range = max - min
  const binSize = range / 23

  // create bins

  const bins: number[] = []
  for (let i = 0; i < 23; i++) {
    bins.push(min + binSize * i)
  }
  bins.push(max)

  const data: any[] = []
  for (let i = 0; i < 23; i++) {
    const count = score.filter(s => s >= bins[i] && s < bins[i + 1]).length
    data.push({ x: bins[i], y: (count / score.length) * 100 })
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
        <BarChart data={data} margin={{ bottom: 15 }}>
          <CartesianGrid strokeDasharray='0 0' opacity={0.5} />
          <XAxis type='number' dataKey='x' name='X' domain={[min - 1, max]}>
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
        <p>{`Score: ${point.x.toFixed(2)}`}</p>
        <p>{`percent: ${point.y.toFixed(2)}%`}</p>
      </div>
    )
  }
  return null
}
