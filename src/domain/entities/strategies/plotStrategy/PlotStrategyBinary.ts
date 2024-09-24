import type { BinaryCalcsType } from '../../../primitives/calcs/calcs'
import type { DataPoint, StringDataPoint } from '../../Quest'
import { PlotStrategyBase } from './PlotStrategy'

export class PlotStrategyBinary extends PlotStrategyBase<'binary'> {
  public getDirectWeight(attrs: BinaryCalcsType): DataPoint[] {
    const weight = attrs.users.weightedScore
    const direct = attrs.users.directScore
    return weight.map((w, i) => ({ x: direct[i], y: w }))
  }

  public getDirectCohrency(attrs: BinaryCalcsType): DataPoint[] {
    const { coherence } = attrs.users
    const direct = attrs.users.directScore
    return coherence.map((c, i) => ({ x: direct[i], y: c }))
  }

  public getDirectMci(attrs: BinaryCalcsType): DataPoint[] {
    const { mci } = attrs.users
    const direct = attrs.users.directScore
    return mci.map((m, i) => ({ x: direct[i], y: m }))
  }
  public getItemDiscrimination(attrs: BinaryCalcsType, id: number): StringDataPoint[] {
    const numUsers = attrs.correctMatrix.length

    return Array.from(Object.entries(attrs.items.altDiscrimination)).map(([key, value]): StringDataPoint => {
      return {
        x: key.split(' ')[1],
        y: value[id] * numUsers,
      }
    })
  }
}
