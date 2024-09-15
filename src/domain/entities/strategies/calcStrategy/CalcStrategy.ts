import { QuestTypesMap } from '../../../primitives'

export interface CalcStrategy<T extends keyof QuestTypesMap> {
  calculate(
    matrix: QuestTypesMap[T]['matrix'],
    keys: string[],
    alternatives: number,
  ): QuestTypesMap[T]['calcs']
  filterMatrix(
    matrx: QuestTypesMap[T]['matrix'],
    activeItems: boolean[],
    activeUsers: boolean[],
  ): QuestTypesMap[T]['matrix']
}
