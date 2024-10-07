import type { BinaryCalcsType } from '../../../primitives/calcs/calcs'
import type { MatrixType } from '../../../primitives/quest'
import { CalcStrategyBase } from './CalcStrategy'
import { binaryChoiceCalculations as bc } from './calculations'

export class CalcStrategyBinary extends CalcStrategyBase<'binary'> {
  public calculate(matrix: MatrixType, keys: string[], alternatives: number): BinaryCalcsType {
    const correctMatrix = bc.correctMatrix(matrix, keys)
    const baseCalcs = this.getBaseCalcs(correctMatrix, keys, matrix)
    const itemsAltDiscDiff = bc.itemsAltDiscDiff(baseCalcs.users.directScore, matrix, alternatives)
    const itemsConflict = bc.itemsConflict(itemsAltDiscDiff[1], baseCalcs.items.discrimination)
    const mci = bc.mci(correctMatrix, baseCalcs.items.difficulty, baseCalcs.users.directScore)
    const coherency = bc.coherency(mci)
    return {
      altFrequencies: bc.altFrequencies(matrix, alternatives),
      correctMatrix: correctMatrix,
      items: {
        ...baseCalcs.items,
        altDifficulty: Object.fromEntries(itemsAltDiscDiff[1]),
        altDiscrimination: Object.fromEntries(itemsAltDiscDiff[0]),
        conflict: itemsConflict,
      },
      users: {
        ...baseCalcs.users,
        weightedScore: bc.weightScore(correctMatrix, baseCalcs.items.discrimination),
        coherence: bc.usersCoherence(correctMatrix),
        mci: mci,
      },
      health: {
        ...baseCalcs.health,
        coherency: coherency,
        difficulty: bc.difficulty(baseCalcs.items.difficulty),
        testHealth: (baseCalcs.health.reliability + baseCalcs.health.discrimination + coherency) / 3,
      },
    }
  }
}
