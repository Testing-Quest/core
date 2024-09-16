import type { BinaryCalcsType } from '../../../primitives/calcs/calcs'
import type { MatrixType } from '../../../primitives/quest'
import { CalcStrategyBase } from './CalcStrategy'
import { BinaryChoiceCalculations as Bcc } from './calculations'

export class CalcStrategyBinary extends CalcStrategyBase<'binary'> {
  public calculate(matrix: MatrixType, keys: string[], alternatives: number): BinaryCalcsType {
    const correctMatrix = Bcc.correctMatrix(matrix, keys)
    const baseCalcs = this.getBaseCalcs(correctMatrix, keys, matrix)
    const itemsAltDiscDiff = Bcc.itemsAltDiscDiff(baseCalcs.users.directScore, correctMatrix, alternatives)
    const itemsConflict = Bcc.itemsConflict(itemsAltDiscDiff[1], baseCalcs.items.discrimination)
    const mci = Bcc.mci(correctMatrix, baseCalcs.items.difficulty, baseCalcs.users.directScore)
    const coherency = Bcc.coherency(mci)
    return {
      correctMatrix: correctMatrix,
      items: {
        ...baseCalcs.items,
        altDifficulty: Object.fromEntries(itemsAltDiscDiff[1]),
        altDiscrimination: Object.fromEntries(itemsAltDiscDiff[0]),
        conflict: itemsConflict,
      },
      users: {
        ...baseCalcs.users,
        weightedScore: Bcc.weightScore(correctMatrix, baseCalcs.items.discrimination),
        coherence: Bcc.usersCoherence(correctMatrix),
        mci: mci,
      },
      health: {
        ...baseCalcs.health,
        coherency: coherency,
        difficulty: Bcc.difficulty(baseCalcs.items.difficulty),
        testHealth: (baseCalcs.health.reliability + baseCalcs.health.discrimination + coherency) / 3,
      },
    }
  }
}
