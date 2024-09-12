import { AggregateRoot } from "./AggregateRoot";
import { BinaryQuestCalculationsType, BinaryQuestType } from "../primitives/binary/binaryQuest";
import { NewQuestType } from "../primitives/quest";
import { BinaryChoiceCalculations as Bcc } from "../services/calculations";


export class BinaryQuest extends AggregateRoot<BinaryQuestType> {
  private _props: BinaryQuestType;
  private _testHealth: number;

  constructor(props: BinaryQuestType) {
    super(props.uuid);
    this._props = props;
    this._testHealth = (props.calculations.reliability + props.calculations.discrimination + props.calculations.coherency) / 3;
  }

  public toJSON(): BinaryQuestType {
    return this._props;
  }

  private static calculate(matrix: string[][], keys: string[], alternatives: number): BinaryQuestCalculationsType {
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
      directScore: usersDirectScore,
      cronbachAlpha: alpha,
      mean: mean,
      sem: Bcc.sem(alpha, standardDeviation),
      variance: variance,
      standardDeviation: standardDeviation,
      reliability: Bcc.reliability(alpha),
      discrimination: Bcc.discrimination(itemsDiscrimination),
      coherency: Bcc.coherency(mci),
      difficulty: Bcc.difficulty(itemsDifficulty),
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
        weightedScore: Bcc.weightScore(correctMatrix, itemsDiscrimination),
        coherence: Bcc.usersCoherence(correctMatrix),
        mci: mci,
        mean: Bcc.usersMean(usersDirectScore, matrix.length),
        totalScore: usersDirectScore,
        blankAnswer: Bcc.usersBlankAnswers(matrix, keys),
      },
    };
  };

  private static cleanupMatrix(matrix: string[][]): string[][] { return matrix };

  public static create(props: NewQuestType): BinaryQuest {
    const matrix = this.cleanupMatrix(props.matrix);
    return new BinaryQuest({
      ...props,
      itemsIds: Array.from({ length: matrix[0].length }, (_, i) => i),
      usersIds: Array.from({ length: matrix.length }, (_, i) => i),
      itemsEnabled: new Array(matrix[0].length).fill(true),
      usersEnabled: new Array(matrix.length).fill(true),
      originalKeys: props.keys,
      matrix,
      calculations: this.calculate(matrix, props.keys, props.alternatives),
    });
  }
}
