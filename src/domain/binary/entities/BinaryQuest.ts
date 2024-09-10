import { AggregateRoot } from "../../AggregateRoot";
import { NewQuestType } from "../../primitives/quest";
import calculateBlankAnswers from "../../services/calculateBlankAnswers";
import calculateCoherence from "../../services/calculateCoherence";
import calculateCorrectMatrix from "../../services/calculateCorrectMatrix";
import calculateDirectScore from "../../services/calculateDirectScore";
import calculateItemsDirectScore from "../../services/calculateItemsDirectScore";
import calculateItemsMean from "../../services/calculateItemsMean";
import calculateItemsVariance from "../../services/calculateItemsVariance";
import calculateMean from "../../services/calculateMean";
import { calculateUserMean } from "../../services/calculateUserMean";
import calculateVariance from "../../services/calculateVariance";
import { BinaryQuestType } from "../primitives/binaryQuest";


export class BinaryQuest extends AggregateRoot<BinaryQuestType> {
  private _attrs: BinaryQuestType;

  constructor(attrs: BinaryQuestType) {
    super(attrs.uuid);
    this._attrs = attrs;
  }

  public toJSON(): BinaryQuestType {
    return this._attrs;
  }

  private static calculate(matrix: string[][], keys: string[], alternatives: number): BynaryQuestType {
    const correctMatrix = calculateCorrectMatrix<string>(matrix, keys)
    // Paralelization 1
    const directScore = calculateDirectScore(correctMatrix);
    const mean = calculateMean(directScore);
    const userMean = calculateUserMean(directScore, correctMatrix[0].length);
    const itemsMean = calculateItemsMean(correctMatrix);
    const variance = calculateVariance(directScore, mean);

    // Paralelization 2
    const coherence = calculateCoherence(correctMatrix);
    const blankAnswers = calculateBlankAnswers<string>(matrix, ['X', 'x', '*', '']);
    const itemsDirectScore = calculateItemsDirectScore(correctMatrix);
    const itemsVariance = calculateItemsVariance(correctMatrix, itemsMean);
    const itemsDiscrimination = calculateItemsDiscrimination(correctMatrix, itemsMean, itemsVariance);
    const itemsDifficulty = calculateItemsDifficulty(correctMatrix, itemsMean);
    const itemCorDiscrimination = calculateItemCorDiscrimination(correctMatrix, itemsMean, itemsVariance);
    const itemsAltDiscrimination = calculateItemsAltDiscrimination(correctMatrix, itemsMean, itemsVariance, alternatives);
    const itemsAltDifficulty = calculateItemsAltDifficulty(correctMatrix, itemsMean, itemsVariance, alternatives);
    const itemsConflicts = calculateItemsConflicts(correctMatrix, itemsMean, itemsVariance, alternatives);
    const itemsChoice = calculateItemsChoice(correctMatrix, itemsMean, itemsVariance, alternatives);
    const userWeightScore = calculateUserWeightScore(correctMatrix);
    const standardDeviation = Math.sqrt(variance);
    const alpha = calculateAlpha(correctMatrix, itemsVariance, variance);
    const sem = calculateSEM(standardDeviation, alpha);
    const discrimination = calculateDiscrimination(itemsDiscrimination);
    const keyConflict
  }

  public static create(quest: NewQuestType): BinaryQuest {

  }
}
