import type { GraduCalcsType } from '../../../primitives/calcs/calcs'
import type { MatrixType } from '../../../primitives/quest'
import { CalcStrategyBase } from './CalcStrategy'
import { GraduatedCalculations as Gc } from './calculations'

export class CalcStrategyGradu extends CalcStrategyBase<'gradu'> {
  public calculate(matrix: MatrixType, keys: string[], alternatives: number): GraduCalcsType {
    const correctMatrix = Gc.correctMatrix(matrix, keys, alternatives)
    const baseCalcs = this.getBaseCalcs(correctMatrix, keys, matrix)
    // itemsStandartDeviation: number[], alternatives: number
    const variability = Gc.variability(baseCalcs.items.variance, alternatives)

    return {
      correctMatrix: correctMatrix,
      items: {
        ...baseCalcs.items,
        altDifficulty: Object.fromEntries(Gc.itemsAltDifficulty(correctMatrix, alternatives)),
      },
      users: {
        ...baseCalcs.users,
      },
      health: {
        ...baseCalcs.health,
        score: Gc.score(correctMatrix),
        variability: variability,
        testHealth: (variability + baseCalcs.health.discrimination + baseCalcs.health.reliability) / 3,
      },
    }
  }
}
