import type { MultiQuestType } from '../../../primitives'
import type { dataPoint } from '../../Quest'
import { PlotStrategyBase } from './PlotStrategy'

export class PlotStrategyMulti extends PlotStrategyBase<'multi'> {
  public getDirectWeight(attrs: MultiQuestType['calcs']): dataPoint[] {
    const weight = attrs.users.weightedScore
    const direct = attrs.users.directScore
    return weight.map((w, i) => ({ x: direct[i], y: w }))
  }

  public getDirectCohrency(attrs: MultiQuestType['calcs']): dataPoint[] {
    const { coherence } = attrs.users
    const direct = attrs.users.directScore
    return coherence.map((c, i) => ({ x: direct[i], y: c }))
  }

  public getDirectMci(attrs: MultiQuestType['calcs']): dataPoint[] {
    const { mci } = attrs.users
    const direct = attrs.users.directScore
    return mci.map((m, i) => ({ x: direct[i], y: m }))
  }
}
