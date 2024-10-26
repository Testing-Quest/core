import { calculateCronbachAlpha } from './calculateAlpha'
import { calculateAltFrequencies, calculateGraduAltFrequencies } from './calculateAltFrequencies'
import { calculateChoice } from './calculateChoice'
import { calculateCoherency } from './calculateCoherency'
import { calculateChoiceCorrectMatrix, calculateGraduCorrectMatrix } from './calculateCorrectMatrix'
import { calculateDifficulty } from './calculateDifficulty'
import { calculateDiscrimination } from './calculateDiscrimination'
import { calculateKeyConflict } from './calculateKeyConflict'
import { calculateMCI } from './calculateMci'
import { calculateMean } from './calculateMean'
import { calculateReliability } from './calculateReliability'
import { calculateScore } from './calculateScore'
import { calculateSEM } from './calculateSem'
import { calculateStandardDeviation } from './calculateStandardDeviation'
import { calculateVariability } from './calculateVariability'
import { calculateVariance } from './calculateVariance'
import {
  calculateBinaryAlternativeDifficulty,
  calculateItemsAlternativeDiscriminationDifficulty,
} from './items/calculateItemsAlternativeDiscDif'
import { calculateItemsChoice } from './items/calculateItemsChoice'
import { calculateItemsConflict } from './items/calculateItemsConflict'
import { calculateItemsCorrectDiscrimination } from './items/calculateItemsCorrectDiscrimination'
import { calculateItemsDifficulty } from './items/calculateItemsDifficulty'
import { calculateItemsDirectScore } from './items/calculateItemsDirectScore'
import { calculateItemsDiscrimination } from './items/calculateItemsDiscrimination'
import { calculateItemsMean } from './items/calculateItemsMean'
import { calculateItemsVariance } from './items/calculateItemsVariance'
import type {
  BasedCalculationsType,
  BinaryChoiceCalculationsType,
  GraduatedCalculationsType,
  MultipleChoiceCalculationsType,
} from './types'
import { calculateUserMean } from './users/calculateUserMean'
import { calculateUsersBlankAnswers } from './users/calculateUsersBlankAnswers'
import { calculateUsersCoherence } from './users/calculateUsersCoherence'
import { calculateUsersDirectScore } from './users/calculateUsersDirectScore'
import { calculateWeightScore } from './users/calculateWeightScore'

export const baseCalculations: BasedCalculationsType = {
  usersDirectScore: calculateUsersDirectScore,
  usersMean: calculateUserMean,
  usersBlankAnswers: calculateUsersBlankAnswers,
  mean: calculateMean,
  variance: calculateVariance,
  itemsDirectScore: calculateItemsDirectScore,
  itemsMean: calculateItemsMean,
  itemsVariance: calculateItemsVariance,
  itemsDiscrimination: calculateItemsDiscrimination,
  itemsDifficulty: calculateItemsDifficulty,
  itemsCorrDiscrimination: calculateItemsCorrectDiscrimination,
  standardDeviation: calculateStandardDeviation,
  alpha: calculateCronbachAlpha,
  sem: calculateSEM,
  reliability: calculateReliability,
  discrimination: calculateDiscrimination,
}

export const multipleChoiceCalculations: MultipleChoiceCalculationsType = {
  altFrequencies: calculateAltFrequencies,
  correctMatrix: calculateChoiceCorrectMatrix,
  usersCoherence: calculateUsersCoherence,
  itemsAltDiscDiff: calculateItemsAlternativeDiscriminationDifficulty,
  itemsConflict: calculateItemsConflict,
  itemsChoice: calculateItemsChoice,
  weightScore: calculateWeightScore,
  keyConflict: calculateKeyConflict,
  choice: calculateChoice,
  mci: calculateMCI,
  coherency: calculateCoherency,
  difficulty: calculateDifficulty,
}

export const binaryChoiceCalculations: BinaryChoiceCalculationsType = {
  altFrequencies: calculateAltFrequencies,
  correctMatrix: calculateChoiceCorrectMatrix,
  usersCoherence: calculateUsersCoherence,
  itemsAltDiscDiff: calculateItemsAlternativeDiscriminationDifficulty,
  itemsConflict: calculateItemsConflict,
  weightScore: calculateWeightScore,
  mci: calculateMCI,
  coherency: calculateCoherency,
  difficulty: calculateDifficulty,
}

export const graduatedCalculations: GraduatedCalculationsType = {
  altFrequencies: calculateGraduAltFrequencies,
  correctMatrix: calculateGraduCorrectMatrix,
  itemsAltDifficulty: calculateBinaryAlternativeDifficulty,
  score: calculateScore,
  variability: calculateVariability,
}
