import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import type { Client } from '../../../../../Client'

type PanelProps = {
  client: Client
}

type HealthData = {
  name: string
  value: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export const HealthChart: React.FC<PanelProps> = ({ client }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<HealthData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const health = await client.getHealth()
        const questType = client.getQuestType()

        let chartData: HealthData[]
        if (questType === 'gradu') {
          chartData = [
            { name: 'Reliability', value: health.health!.reliability || 0 },
            { name: 'Discrimination', value: health.health!.discrimination || 0 },
            { name: 'Variability', value: health.health!.variability || 0 },
          ]
        } else {
          chartData = []
        }

        setData(chartData)
      } catch (error) {
        console.error('Error fetching health data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [client])

  if (loading) {
    return <Spin size='large' />
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx='50%' cy='50%' labelLine={false} outerRadius={80} fill='#8884d8' dataKey='value'>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HealthChart
