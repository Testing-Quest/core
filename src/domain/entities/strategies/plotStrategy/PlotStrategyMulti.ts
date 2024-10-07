import type { MultiCalcsType } from '../../../primitives/calcs/calcs'
import type { DataPoint, StringDataPoint } from '../../Quest'
import { PlotStrategyBase } from './PlotStrategy'

export class PlotStrategyMulti extends PlotStrategyBase<'multi'> {
  public getDirectWeight(attrs: MultiCalcsType, users: boolean[]): DataPoint[] {
    const weight = attrs.users.weightedScore
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i+1 : -1)).filter(u => u !== -1)
    return weight.map((w, i) => ({ x: direct[i], y: w, hover: activeUsers[i] }))
  }

  public getDirectCohrency(attrs: MultiCalcsType, users: boolean[]): DataPoint[] {
    const { coherence } = attrs.users
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i+1 : -1)).filter(u => u !== -1)
    return coherence.map((c, i) => ({ x: direct[i], y: c, hover: activeUsers[i] }))
  }

  public getDirectMci(attrs: MultiCalcsType, users: boolean[]): DataPoint[] {
    const { mci } = attrs.users
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i+1 : -1)).filter(u => u !== -1)
    return mci.map((m, i) => ({ x: direct[i], y: m, hover: activeUsers[i] }))
  }

  public getItemDiscrimination(attrs: MultiCalcsType, id: number): StringDataPoint[] {
    return Array.from(Object.entries(attrs.items.altDiscrimination)).map(([key, value]): StringDataPoint => {
      return {
        x: key.split(' ')[1],
        y: value[id],
      }
    })
  }
}
