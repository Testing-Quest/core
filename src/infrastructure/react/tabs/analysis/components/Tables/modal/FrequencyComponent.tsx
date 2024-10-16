import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts'

type FrequencyData = {
  x: string
  y: number
}

type FrequencyComponentProps = {
  data: {
    data: FrequencyData[]
    error: null | string
  }
}

export const FrequencyComponent: React.FC<FrequencyComponentProps> = ({ data }) => {
  if (data.error) {
    return <div>Error: {data.error}</div>
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ResponsiveContainer>
        <BarChart data={data.data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='x'>
            <Label value='Option' position='insideBottom' offset={-10} />
          </XAxis>
          <YAxis>
            <Label value='Frequency' angle={-90} position='insideLeft' offset={0} />
          </YAxis>
          <Tooltip
            formatter={(value: number) => [value.toFixed(2), 'Frequency']}
            labelStyle={{ color: 'black' }}
            itemStyle={{ color: 'black' }}
          />
          <Bar dataKey='y' fill='#82ca9d' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
