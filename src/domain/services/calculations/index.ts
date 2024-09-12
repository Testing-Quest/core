import { calculateCronbachAlpha } from "./calculateAlpha";
import { calculateChoice } from "./calculateChoice";
import { calculateCoherency } from "./calculateCoherency";
import { calculateCorrectMatrix } from "./calculateCorrectMatrix";
import { calculateDifficulty } from "./calculateDifficulty";
import { calculateDiscrimination } from "./calculateDiscrimination";
import { calculateKeyConflict } from "./calculateKeyConflict";
import { calculateMCI } from "./calculateMci";
import { calculateMean } from "./calculateMean";
import { calculateReliability } from "./calculateReliability";
import { calculateSEM } from "./calculateSem";
import { calculateStandardDeviation } from "./calculateStandardDeviation";
import { calculateVariance } from "./calculateVariance";
import { calculateItemsAlternativeDiscriminationDifficulty } from "./items/calculateItemsAlternativeDiscDif";
import { calculateItemsChoice } from "./items/calculateItemsChoice";
import { calculateItemsConflict } from "./items/calculateItemsConflict";
import { calculateItemsCorrectDiscrimination } from "./items/calculateItemsCorrectDiscrimination";
import { calculateItemsDifficulty } from "./items/calculateItemsDifficulty";
import { calculateItemsDirectScore } from "./items/calculateItemsDirectScore";
import { calculateItemsDiscrimination } from "./items/calculateItemsDiscrimination";
import { calculateItemsMean } from "./items/calculateItemsMean";
import { calculateItemsVariance } from "./items/calculateItemsVariance";
import { MultipleChoiceCalculationsType } from "./types";
import { calculateUserMean } from "./users/calculateUserMean";
import { calculateUsersBlankAnswers } from "./users/calculateUsersBlankAnswers";
import { calculateUsersCoherence } from "./users/calculateUsersCoherence";
import { calculateUsersDirectScore } from "./users/calculateUsersDirectScore";
import { calculateWeightScore } from "./users/calculateWeightScore";


export const MultipleChoiceCalculations: MultipleChoiceCalculationsType = {
  correctMatrix: calculateCorrectMatrix<string>,
  usersDirectScore: calculateUsersDirectScore,
  usersMean: calculateUserMean,
  usersCoherence: calculateUsersCoherence,
  usersBlankAnswers: calculateUsersBlankAnswers,
  mean: calculateMean,
  variance: calculateVariance,
  itemsDirectScore: calculateItemsDirectScore,
  itemsMean: calculateItemsMean,
  itemsVariance: calculateItemsVariance,
  itemsDiscrimination: calculateItemsDiscrimination,
  itemsDifficulty: calculateItemsDifficulty,
  itemsCorrDiscrimination: calculateItemsCorrectDiscrimination,
  itemsAltDiscDiff: calculateItemsAlternativeDiscriminationDifficulty,
  itemsConflict: calculateItemsConflict,
  itemsChoice: calculateItemsChoice,
  weightScore: calculateWeightScore,
  standardDeviation: calculateStandardDeviation,
  alpha: calculateCronbachAlpha,
  sem: calculateSEM,
  reliability: calculateReliability,
  discrimination: calculateDiscrimination,
  keyConflict: calculateKeyConflict,
  choice: calculateChoice,
  mci: calculateMCI,
  coherency: calculateCoherency,
  difficulty: calculateDifficulty,
}
