import type { QuestTypesMap } from '../../../primitives'
import type { CalcStrategy } from './CalcStrategy'
import { CalcStrategyBinary } from './CalcStrategyBinary'
import { CalcStrategyGradu } from './CalcStrategyGradu'
import { CalcStrategyMulti } from './CalcStrategyMulti'

export function calcFactory<T extends keyof QuestTypesMap>(type: T): CalcStrategy<T> {
  switch (type) {
    case 'gradu':
      return new CalcStrategyGradu()
    case 'multi':
      return new CalcStrategyMulti()
    case 'binary':
      return new CalcStrategyBinary()
    default:
      throw new Error('Invalid calc type')
  }
}
