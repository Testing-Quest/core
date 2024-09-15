import { QuestTypesMap } from '../../../primitives'
import {
  TableStrategy,
  TableStrategyBinary,
  TableStrategyGradu,
  TableStrategyMulti,
} from './TableStrategy'

export function tableFactory<T extends keyof QuestTypesMap>(
  type: T,
): TableStrategy<T> {
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
