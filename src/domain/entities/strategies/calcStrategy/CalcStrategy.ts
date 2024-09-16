import type { QuestTypesMap } from '../../../primitives'


type BaseCalcs = {
  health: {
    cronbachAlpha: number
    sem: number
    mean: number
    variance: number
    standardDeviation: number
    reliability: number
    discrimination: number
    testHealth: number
  }
  items: {
    itemsIds: number[]
    itemsEnabled: boolean[]
    variance: number[]
    discrimination: number[]
    corrDiscrimination: number[]
    difficulty: number[]
    altDifficulty: Record<string, number[]>
  }
  users: {
    usersIds: number[]
    usersEnabled: boolean[]
    directScore: number[]
    mean: number[]
    totalScore: number[]
    blankAnswer: number[]
  }
}

export type CalcStrategy<T extends keyof QuestTypesMap> = {
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

export abstract class CalcStrategyBase<T extends keyof QuestTypesMap> implements CalcStrategy<T> {
  abstract calculate(
    matrix: QuestTypesMap[T]['matrix'],
    keys: string[],
    alternatives: number,
  ): QuestTypesMap[T]['calcs']
  filterMatrix(
    matrx: QuestTypesMap[T]['matrix'],
    activeItems: boolean[],
    activeUsers: boolean[],
  ): QuestTypesMap[T]['matrix'] {
    return matrx
      .filter((_, rowIndex) => activeUsers[rowIndex])
      .map(row => row.filter((_, columnIndex) => activeItems[columnIndex])) as QuestTypesMap[T]['matrix']
  }

  getBaseCalcs(correctMatrix: number[][], keys: string[], matrix: QuestTypesMap[T]['matrix']) { }
}

