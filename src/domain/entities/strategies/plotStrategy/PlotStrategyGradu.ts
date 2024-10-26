import type { GraduCalcsType } from '../../../primitives/calcs/calcs'
import { MatrixType } from '../../../primitives/quest'
import type { DataPoint, SimpleDataPoint, StringDataPoint } from '../../Quest'
import { PlotStrategyBase } from './PlotStrategy'

export class PlotStrategyGradu extends PlotStrategyBase<'gradu'> {
  public getDirectWeight(): DataPoint[] {
    throw new Error('Not implemented')
  }
  public getDirectCohrency(): DataPoint[] {
    throw new Error('Not implemented')
  }
  public getDirectMci(): DataPoint[] {
    throw new Error('Not implemented')
  }
  public getItemDiscrimination(): StringDataPoint[] {
    throw new Error('Not implemented')
  }
  public getItemProfile(
    attrs: { matrix: MatrixType; alternatives: number; calcs: GraduCalcsType },
    id: number,
  ): Record<string, SimpleDataPoint[]> {
    const groupCount = 5
    const [totalResponseByGroup, usersGroups] = this.sharedItemProfile(attrs, groupCount)
    const itemResponses = attrs.matrix.map(row => row[id])
    const validAlternatives = [...Array.from({ length: attrs.alternatives }, (_, i) => i + 1), 'X']

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
