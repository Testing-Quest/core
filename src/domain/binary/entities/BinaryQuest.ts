import { AggregateRoot } from "../../AggregateRoot";
import { NewQuestType } from "../../primitives/quest";
import calculateUsersBlankAnswers from "../../services/calculations/users/calculateUsersBlankAnswers";
import calculateUsersCoherence from "../../services/calculations/users/calculateUsersCoherence";
import calculateCorrectMatrix from "../../services/calculations/calculateCorrectMatrix";
import calculateUsersDirectScore from "../../services/calculations/users/calculateUsersDirectScore";
import calculateItemsDirectScore from "../../services/calculations/items/calculateItemsDirectScore";
import calculateItemsMean from "../../services/calculations/items/calculateItemsMean";
import calculateItemsVariance from "../../services/calculations/items/calculateItemsVariance";
import calculateMean from "../../services/calculations/calculateMean";
import { calculateUserMean } from "../../services/calculations/users/calculateUserMean";
import calculateVariance from "../../services/calculations/calculateVariance";
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
    const directScore = calculateUsersDirectScore(correctMatrix);
    const mean = calculateMean(directScore);
    const userMean = calculateUserMean(directScore, correctMatrix[0].length);
    const itemsMean = calculateItemsMean(correctMatrix);
    const variance = calculateVariance(directScore, mean);

    // Paralelization 2
    const coherence = calculateUsersCoherence(correctMatrix);
    const blankAnswers = calculateUsersBlankAnswers<string>(matrix, ['X', 'x', '*', '']);
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
