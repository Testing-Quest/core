import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts'

type ProfileData = {
  x: number
  y: number
}

type ProfileComponentProps = {
  data: {
    data: Record<string, ProfileData[]>
    error: null | string
  }
}

// Función para generar una paleta de colores más amplia
const generateColors = (count: number) => {
  const hueStep = 360 / count
  return Array.from({ length: count }, (_, i) => `hsl(${i * hueStep}, 70%, 50%)`)
}

export const ProfileComponent: React.FC<ProfileComponentProps> = ({ data }) => {
  if (data.error) {
    return <div>Error: {data.error}</div>
  }

  const colors = generateColors(Object.keys(data.data).length)
  const allData = Object.values(data.data).flat()
  const maxY = Math.max(...allData.map(item => item.y))

  const transformedData = data.data[Object.keys(data.data)[0]].map((item, index) => {
    const newItem: { [x: string]: number } = { x: item.x + 1 }
    Object.keys(data.data).forEach(key => {
      newItem[key] = data.data[key][index].y
    })
    return newItem
  })

  return (
    <div style={{ height: '500px', width: '100%', display: 'flex' }}>
      <ResponsiveContainer>
        <LineChart data={transformedData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='x' tickFormatter={value => `${value}`}>
            <Label value='Score' position='insideBottom' offset={-10} />
          </XAxis>
          <YAxis domain={[0, maxY]} tickFormatter={value => value.toFixed(2)}>
            <Label value='Frequency' angle={-90} position='insideLeft' offset={0} />
          </YAxis>
          <Tooltip
            formatter={(value: number, name: string) => [value.toFixed(2), name]}
            labelFormatter={label => `Score: ${label}`}
            labelStyle={{ color: 'black' }}
            itemStyle={{ color: 'black' }}
          />
          {Object.keys(data.data).map((key, index) => (
            <Line key={key} type='monotone' dataKey={key} stroke={colors[index]} activeDot={{ r: 8 }} />
          ))}
          <Legend
            layout='vertical'
            align='left'
            verticalAlign='middle'
            wrapperStyle={{ left: 0, marginRight: '20px' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
