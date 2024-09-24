import type { QuestTypesMap } from '../../../primitives'
import type { MatrixType } from '../../../primitives/quest'
import { baseCalculations as Bc } from './calculations'

export type BaseCalcs = {
  health: {
    cronbachAlpha: number
    sem: number
    mean: number
    variance: number
    standardDeviation: number
    reliability: number
    discrimination: number
  }
  items: {
    itemsIds: number[]
    itemsEnabled: boolean[]
    variance: number[]
    discrimination: number[]
    corrDiscrimination: number[]
    difficulty: number[]
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
  calculate(matrix: MatrixType, keys: string[], alternatives: number): QuestTypesMap[T]['calcs']
  filterMatrix(matrx: MatrixType, activeItems: boolean[], activeUsers: boolean[]): MatrixType
}

export abstract class CalcStrategyBase<T extends keyof QuestTypesMap> implements CalcStrategy<T> {
  public filterMatrix(matrx: MatrixType, activeItems: boolean[], activeUsers: boolean[]): MatrixType {
    return matrx
      .filter((_, rowIndex) => activeUsers[rowIndex])
      .map(row => row.filter((_, columnIndex) => activeItems[columnIndex]))
  }

  public getBaseCalcs(correctMatrix: number[][], keys: string[], matrix: MatrixType): BaseCalcs {
    const usersDirectScore = Bc.usersDirectScore(correctMatrix)
    const mean = Bc.mean(usersDirectScore)
    const variance = Bc.variance(usersDirectScore, mean)
    const itemsDirectScore = Bc.itemsDirectScore(correctMatrix)
    const itemsMean = Bc.itemsMean(correctMatrix)
    const itemsVariance = Bc.itemsVariance(correctMatrix, itemsMean)
    const itemsDiscrimination = Bc.itemsDiscrimination(correctMatrix, usersDirectScore)
    const itemsDifficulty = Bc.itemsDifficulty(itemsDirectScore, matrix.length)

    const standardDeviation = Bc.standardDeviation(variance)
    const alpha = Bc.alpha(correctMatrix, itemsVariance, variance)

    return {
      health: {
        cronbachAlpha: alpha,
        sem: Bc.sem(alpha, standardDeviation),
        mean: mean,
        variance: variance,
        standardDeviation: standardDeviation,
        reliability: Bc.reliability(alpha),
        discrimination: Bc.discrimination(itemsDiscrimination),
      },
      items: {
        itemsIds: Array.from({ length: itemsDirectScore.length }, (_, i) => i),
        itemsEnabled: new Array(itemsDirectScore.length).fill(true) as boolean[],
        variance: itemsVariance,
        discrimination: itemsDiscrimination,
        corrDiscrimination: Bc.itemsCorrDiscrimination(itemsDiscrimination, itemsVariance, variance),
        difficulty: itemsDifficulty,
      },
      users: {
        usersIds: Array.from({ length: usersDirectScore.length }, (_, i) => i),
        usersEnabled: new Array(usersDirectScore.length).fill(true) as boolean[],
        directScore: usersDirectScore,
        mean: Bc.usersMean(usersDirectScore, matrix.length),
        totalScore: usersDirectScore,
        blankAnswer: Bc.usersBlankAnswers(matrix, keys),
      },
    }
  }

  public abstract calculate(matrix: MatrixType, keys: string[], alternatives: number): QuestTypesMap[T]['calcs']
}
