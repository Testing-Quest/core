import type { QuestTypesMap } from '../../../primitives'
import type { TableStrategy } from './TableStrategy'
import { TableStrategyBinary } from './TableStrategyBinary'
import { TableStrategyGradu } from './TableStrategyGradu'
import { TableStrategyMulti } from './TableStrategyMulti'

export function tableFactory<T extends keyof QuestTypesMap>(type: T): TableStrategy<T> {
  switch (type) {
    case 'gradu':
      return new TableStrategyGradu()
    case 'multi':
      return new TableStrategyMulti()
    case 'binary':
      return new TableStrategyBinary()
    default:
      throw new Error('Invalid calc type')
  }
}
