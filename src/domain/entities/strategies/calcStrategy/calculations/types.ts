import type { MatrixType } from '../../../../primitives/quest'

export type BasedCalculationsType = {
  usersDirectScore(correctMatrix: number[][]): number[]
  usersMean(usersDirectScore: number[], totalItems: number): number[]
  usersBlankAnswers(matrix: MatrixType, omissions: (string | number)[]): number[]
  mean(usersDirectScore: number[]): number
  variance(usersDirectScore: number[], mean: number): number
  itemsDirectScore(correctMatrix: number[][]): number[]
  itemsMean(correctMatrix: number[][]): number[]
  itemsVariance(correctMatrix: number[][], itemsMean: number[]): number[]
  itemsDiscrimination(correctMatrix: number[][], usersDirectScore: number[]): number[]
  itemsDifficulty(itemsDirectScore: number[], totalUsers: number): number[]
  itemsCorrDiscrimination(itemsDiscrimination: number[], itemsVariance: number[], variance: number): number[]
  standardDeviation(variance: number): number
  alpha(correctMatrix: number[][], itemsVariance: number[], variance: number): number
  sem(alpha: number, standardDeviation: number): number
  reliability(alpha: number): number
  discrimination(itemsDiscrimination: number[]): number
}

export type MultipleChoiceCalculationsType = {
  altFrequencies(matrix: MatrixType, alternatives: number): Record<string, number>
  correctMatrix(matrix: MatrixType, keys: string[]): number[][]
  usersCoherence(correctMatrix: number[][]): number[]
  itemsAltDiscDiff(
    usersDirectScore: number[],
    matrix: MatrixType,
    numAlternatives: number,
  ): [Map<string, number[]>, Map<string, number[]>]
  itemsConflict(alternativeDiscrimination: Map<string, number[]>, itemDiscrimination: number[]): boolean[]
  itemsChoice(
    keys: string[],
    alternatives: number,
    alternativeDifficulty: Map<string, number[]>,
    numUsers: number,
    numItems: number,
  ): boolean[]

  weightScore(correctMatrix: number[][], itemsDiscrimination: number[]): number[]
  keyConflict(itemsConflict: boolean[]): number
  choice(itemsChoice: boolean[]): number
  mci(correctMatrix: number[][], itemsDifficulty: number[], directScore: number[]): number[]
  coherency(mci: number[]): number
  difficulty(itemsDifficulty: number[]): number
}

export type BinaryChoiceCalculationsType = {
  altFrequencies(matrix: MatrixType, alternatives: number): Record<string, number>
  correctMatrix(matrix: MatrixType, keys: string[]): number[][]
  usersCoherence(correctMatrix: number[][]): number[]
  itemsAltDiscDiff(
    usersDirectScore: number[],
    matrix: MatrixType,
    numAlternatives: number,
  ): [Map<string, number[]>, Map<string, number[]>]
  itemsConflict(alternativeDiscrimination: Map<string, number[]>, itemDiscrimination: number[]): boolean[]

  weightScore(correctMatrix: number[][], itemsDiscrimination: number[]): number[]
  mci(correctMatrix: number[][], itemsDifficulty: number[], directScore: number[]): number[]
  coherency(mci: number[]): number
  difficulty(itemsDifficulty: number[]): number
}

export type GraduatedCalculationsType = {
  altFrequencies(matrix: MatrixType): Record<string, number>
  correctMatrix(matrix: MatrixType, keys: string[], alternatives: number): number[][]
  itemsAltDifficulty(correctMatrix: number[][], alternatives: number): Map<string, number[]>
  score(correctMatrix: number[][]): number
  variability(itemsVariance: number[], alternatives: number): number
}
