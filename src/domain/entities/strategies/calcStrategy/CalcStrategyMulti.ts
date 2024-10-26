import type { MultiCalcsType } from '../../../primitives/calcs/calcs'
import type { MatrixType } from '../../../primitives/quest'
import { CalcStrategyBase } from './CalcStrategy'
import { multipleChoiceCalculations as mc } from './calculations'

export class CalcStrategyMulti extends CalcStrategyBase<'multi'> {
  public calculate(matrix: MatrixType, keys: string[], alternatives: number): MultiCalcsType {
    const correctMatrix = mc.correctMatrix(matrix, keys)
    const baseCalcs = this.getBaseCalcs(correctMatrix, keys, matrix)
    const itemsAltDiscDiff = mc.itemsAltDiscDiff(baseCalcs.users.directScore, matrix, alternatives)
    const itemsConflict = mc.itemsConflict(itemsAltDiscDiff[0], baseCalcs.items.discrimination)
    const mci = mc.mci(correctMatrix, baseCalcs.items.difficulty, baseCalcs.users.directScore)
    const coherency = mc.coherency(mci)
    const itemsChoice = mc.itemsChoice(keys, alternatives, itemsAltDiscDiff[1], matrix.length, matrix[0].length)
    const keyConflict = mc.keyConflict(itemsConflict)
    const choice = mc.choice(itemsChoice)

    return {
      altFrequencies: mc.altFrequencies(matrix, alternatives),
      correctMatrix: correctMatrix,
      items: {
        ...baseCalcs.items,
        altDifficulty: Object.fromEntries(itemsAltDiscDiff[1]),
        altDiscrimination: Object.fromEntries(itemsAltDiscDiff[0]),
        conflict: itemsConflict,
        choice: itemsChoice,
      },
      users: {
        ...baseCalcs.users,
        weightedScore: mc.weightScore(correctMatrix, baseCalcs.items.discrimination),
        coherence: mc.usersCoherence(correctMatrix),
        mci: mci,
      },
      health: {
        ...baseCalcs.health,
        coherency: coherency,
        difficulty: mc.difficulty(baseCalcs.items.difficulty),
        testHealth:
          (baseCalcs.health.reliability + baseCalcs.health.discrimination + coherency + keyConflict + choice) / 5,
        choice: choice,
        keyConflict: keyConflict,
      },
    }
  }
}
