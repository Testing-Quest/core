import React, { useEffect, useState, useMemo } from 'react'
import { Spin } from 'antd'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { GetHealthResponse } from '../../../../../../application/responses/getHealthResponse'

type PanelProps = {
  data: GetHealthResponse['data']
  propertyMap: Record<string, string>
  fontSize: string
}

type HealthData = {
  name: string
  value: number
}

const COLORS = ['#592E83', '#B27C66', '#6D8EA0', '#846954', '#230C33']

export const HealthChart: React.FC<PanelProps> = ({ data, propertyMap, fontSize }) => {
  const [loading, setLoading] = useState(true)

  const chartData = useMemo(() => {
    if (!data) return []
    return Object.entries(propertyMap)
      .map(([key, name]) => {
        const value = data[key]
        if (typeof value !== 'number') return null
        return {
          name,
          value: Math.max(0, 100 - value * 100),
        }
      })
      .filter((item): item is HealthData => item !== null && item.value > 0)
  }, [data, propertyMap])

  useEffect(() => {
    setLoading(false)
  }, [data])

  if (loading) {
    return <Spin tip='Loading chart data...' />
  }

  if (chartData.length === 0) {
    return <div>No health issues to display.</div>
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <ResponsiveContainer width='100%' height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx='50%'
          cy='50%'
          labelLine={false}
          outerRadius={120} // Increased outer radius
          fill='#8884d8'
          dataKey='value'
          isAnimationActive={false}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${((value / total) * 100).toFixed(2)}%`} labelStyle={{ fontSize }} />
        <Legend layout='vertical' align='right' verticalAlign='middle' wrapperStyle={{ fontSize }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default HealthChart
