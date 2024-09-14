import { BinaryQuestType } from "../../../primitives";
import { BinaryQuestCalculationsType } from "../../../primitives/binary/binaryQuest";
import { CalcStrategyBase } from "./CalcStrategy";
import { BinaryChoiceCalculations as Bcc } from "./calculations";

export class CalcStrategyMulti extends CalcStrategyBase<BinaryQuestType> {
  public filterMatrix(matrix: string[][], activeItems: boolean[], activeUsers: boolean[]): string[][] {
    return matrix
      .filter((_, rowIndex) => activeUsers[rowIndex])
      .map(row => row.filter((_, columnIndex) => activeItems[columnIndex
      ]));
  }
  public calculate(matrix: string[][], keys: string[], alternatives: number): BinaryQuestCalculationsType {
    const correctMatrix = Bcc.correctMatrix(matrix, keys);
    const usersDirectScore = Bcc.usersDirectScore(correctMatrix);
    const mean = Bcc.mean(usersDirectScore);
    const variance = Bcc.variance(usersDirectScore, mean);
    const itemsDirectScore = Bcc.itemsDirectScore(correctMatrix);
    const itemsMean = Bcc.itemsMean(correctMatrix);
    const itemsVariance = Bcc.itemsVariance(correctMatrix, itemsMean);
    const itemsDiscrimination = Bcc.itemsDiscrimination(correctMatrix, usersDirectScore);
    const itemsDifficulty = Bcc.itemsDifficulty(itemsDirectScore, matrix.length);
    const itemsAltDiscDiff = Bcc.itemsAltDiscDiff(usersDirectScore, matrix, alternatives);
    const standardDeviation = Bcc.standardDeviation(variance);
    const alpha = Bcc.alpha(correctMatrix, itemsVariance, variance);
    const mci = Bcc.mci(correctMatrix, itemsDifficulty, usersDirectScore);

    return {
      correctedMatrix: correctMatrix,
      coherency: Bcc.coherency(mci),
      difficulty: Bcc.difficulty(itemsDifficulty),
      health: {
        cronbachAlpha: alpha,
        sem: Bcc.sem(alpha, standardDeviation),
        mean: mean,
        variance: variance,
        standardDeviation: standardDeviation,
        reliability: Bcc.reliability(alpha),
        discrimination: Bcc.discrimination(itemsDiscrimination),
        testHealth: (Bcc.reliability(alpha) + Bcc.discrimination(itemsDiscrimination) + Bcc.coherency(mci)) / 3,
      },
      items: {
        variance: itemsVariance,
        discrimination: itemsDiscrimination,
        corrDiscrimination: Bcc.itemsCorrDiscrimination(itemsDiscrimination, itemsVariance, variance),
        altDifficulty: Object.fromEntries(itemsAltDiscDiff[1]),
        altDiscrimination: Object.fromEntries(itemsAltDiscDiff[0]),
        difficulty: itemsDifficulty,
        choice: Bcc.itemsChoice(keys, alternatives, itemsAltDiscDiff[1], matrix.length, keys.length),
        conflict: Bcc.itemsConflict(itemsAltDiscDiff[0], itemsDiscrimination),
      },
      users: {
        directScore: usersDirectScore,
        weightedScore: Bcc.weightScore(correctMatrix, itemsDiscrimination),
        coherence: Bcc.usersCoherence(correctMatrix),
        mci: mci,
        mean: Bcc.usersMean(usersDirectScore, matrix.length),
        totalScore: usersDirectScore,
        blankAnswer: Bcc.usersBlankAnswers(matrix, keys),
      },
    };
  }
}
