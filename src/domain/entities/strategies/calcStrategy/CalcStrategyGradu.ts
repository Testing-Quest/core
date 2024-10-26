import type { GraduCalcsType } from '../../../primitives/calcs/calcs'
import type { MatrixType } from '../../../primitives/quest'
import { CalcStrategyBase } from './CalcStrategy'
import { graduatedCalculations as gc } from './calculations'

export class CalcStrategyGradu extends CalcStrategyBase<'gradu'> {
  public calculate(matrix: MatrixType, keys: string[], alternatives: number): GraduCalcsType {
    const correctMatrix = gc.correctMatrix(matrix, keys, alternatives)
    const baseCalcs = this.getBaseCalcs(correctMatrix, keys, matrix)
    const variability = gc.variability(baseCalcs.items.variance, alternatives)

    return {
      altFrequencies: gc.altFrequencies(matrix),
      correctMatrix: correctMatrix,
      items: {
        ...baseCalcs.items,
        altDifficulty: Object.fromEntries(gc.itemsAltDifficulty(correctMatrix, alternatives)),
      },
      users: {
        ...baseCalcs.users,
      },
      health: {
        ...baseCalcs.health,
        score: gc.score(correctMatrix),
        variability: variability,
        testHealth: (variability + baseCalcs.health.discrimination + baseCalcs.health.reliability) / 3,
      },
    }
  }
}
