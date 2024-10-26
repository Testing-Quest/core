import { DataPoint } from '../../../../../../domain/entities/Quest'

export function getCorrelation(data: DataPoint[] | undefined): string {
  if (!data) return 'N/A'
  const x = data.map(point => point.x)
  const y = data.map(point => point.y)
  const n = data.length

  const sumX = x.reduce((acc, value) => acc + value, 0)
  const sumY = y.reduce((acc, value) => acc + value, 0)
  const sumXY = x.reduce((acc, value, i) => acc + value * y[i], 0)
  const sumX2 = x.reduce((acc, value) => acc + value ** 2, 0)
  const sumY2 = y.reduce((acc, value) => acc + value ** 2, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2))

  return (numerator / denominator).toFixed(2)
}
