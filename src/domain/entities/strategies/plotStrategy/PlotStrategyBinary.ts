import { allAlternatives } from '../../../primitives'
import type { BinaryCalcsType } from '../../../primitives/calcs/calcs'
import { MatrixType } from '../../../primitives/quest'
import type { DataPoint, SimpleDataPoint, StringDataPoint } from '../../Quest'
import { PlotStrategyBase } from './PlotStrategy'

export class PlotStrategyBinary extends PlotStrategyBase<'binary'> {
  public getDirectWeight(attrs: BinaryCalcsType, users: boolean[]): DataPoint[] {
    const weight = attrs.users.weightedScore
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i + 1 : -1)).filter(u => u !== -1)
    return weight.map((w, i) => ({ x: direct[i], y: w, hover: activeUsers[i] }))
  }

  public getDirectCohrency(attrs: BinaryCalcsType, users: boolean[]): DataPoint[] {
    const { coherence } = attrs.users
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i + 1 : -1)).filter(u => u !== -1)
    return coherence.map((c, i) => ({ x: direct[i], y: c, hover: activeUsers[i] }))
  }

  public getDirectMci(attrs: BinaryCalcsType, users: boolean[]): DataPoint[] {
    const { mci } = attrs.users
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i + 1 : -1)).filter(u => u !== -1)
    return mci.map((m, i) => ({ x: direct[i], y: m, hover: activeUsers[i] }))
  }
  public getItemDiscrimination(attrs: BinaryCalcsType, id: number): StringDataPoint[] {
    return Array.from(Object.entries(attrs.items.altDiscrimination)).map(([key, value]): StringDataPoint => {
      return {
        x: key.split(' ')[1],
        y: value[id],
      }
    })
  }

  public getItemProfile(
    attrs: { matrix: MatrixType; alternatives: number; calcs: BinaryCalcsType },
    id: number,
  ): Record<string, SimpleDataPoint[]> {
    const groupCount = 5
    const itemResponses = attrs.matrix.map(row => row[id])
    const validAlternatives = [...allAlternatives.slice(0, attrs.alternatives), 'X']
    const [totalResponseByGroup, usersGroups] = this.sharedItemProfile(attrs, groupCount)

    return Object.fromEntries(
      validAlternatives.map(key => {
        const dataPoints = Array.from({ length: groupCount }, (_, group) => {
          const count = itemResponses.filter(
            (response, index) => response === key && usersGroups[index] === group,
          ).length
          const total = totalResponseByGroup[group] || 1 // Evitar división por cero
          return {
            x: group,
            y: count / total, // Proporción en lugar del conteo directo
          }
        })
        return [key, dataPoints]
      }),
    )
  }
}
