import { QuestTypesMap } from '../../../primitives'
import { PlotStrategy } from './PlotStrategy'
import { PlotStrategyBinary } from './PlotStrategyBinary'
import { PlotStrategyGradu } from './PlotStrategyGradu'
import { PlotStrategyMulti } from './PlotStrategyMulti'

export function plotFactory<T extends keyof QuestTypesMap>(
  type: T,
): PlotStrategy<T> {
  switch (type) {
    case 'gradu':
      return new PlotStrategyGradu()
    case 'multi':
      return new PlotStrategyMulti()
    case 'binary':
      return new PlotStrategyBinary()
    default:
      throw new Error('Invalid calc type')
  }
}
