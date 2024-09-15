export type MultipleChoiceCalculationsType = {
  correctMatrix(matrix: string[][], keys: string[]): number[][]
  usersDirectScore(correctMatrix: number[][]): number[]
  usersMean(usersDirectScore: number[], totalItems: number): number[]
  usersCoherence(correctMatrix: number[][]): number[]
  usersBlankAnswers(matrix: string[][], omissions: string[]): number[]

  mean(usersDirectScore: number[]): number
  variance(usersDirectScore: number[], mean: number): number

  itemsDirectScore(correctMatrix: number[][]): number[]
  itemsMean(correctMatrix: number[][]): number[]
  itemsVariance(correctMatrix: number[][], itemsMean: number[]): number[]
  itemsDiscrimination(
    correctMatrix: number[][],
    usersDirectScore: number[],
  ): number[]
  itemsDifficulty(itemsDirectScore: number[], totalUsers: number): number[]
  itemsCorrDiscrimination(
    itemsDiscrimination: number[],
    itemsVariance: number[],
    variance: number,
  ): number[]
  itemsAltDiscDiff(
    usersDirectScore: number[],
    matrix: string[][],
    numAlternatives: number,
  ): [Map<string, number[]>, Map<string, number[]>]
  itemsConflict(
    alternativeDiscrimination: Map<string, number[]>,
    itemDiscrimination: number[],
  ): boolean[]
  itemsChoice(
    keys: string[],
    alternatives: number,
    alternativeDifficulty: Map<string, number[]>,
    numUsers: number,
    numItems: number,
  ): boolean[]

  weightScore(
    correctMatrix: number[][],
    itemsDiscrimination: number[],
  ): number[]
  standardDeviation(variance: number): number
  alpha(
    correctMatrix: number[][],
    itemsVariance: number[],
    variance: number,
  ): number
  sem(alpha: number, standardDeviation: number): number
  reliability(alpha: number): number
  discrimination(itemsDiscrimination: number[]): number
  keyConflict(itemsConflict: boolean[]): number
  choice(itemsChoice: boolean[]): number
  mci(
    correctMatrix: number[][],
    itemsDifficulty: number[],
    directScore: number[],
  ): number[]
  coherency(mci: number[]): number
  difficulty(itemsDifficulty: number[]): number
  // test health
}

export type BinaryChoiceCalculationsType = {
  correctMatrix(matrix: string[][], keys: string[]): number[][]
  usersDirectScore(correctMatrix: number[][]): number[]
  usersMean(usersDirectScore: number[], totalItems: number): number[]
  usersCoherence(correctMatrix: number[][]): number[]
  usersBlankAnswers(matrix: string[][], omissions: string[]): number[]

  mean(usersDirectScore: number[]): number
  variance(usersDirectScore: number[], mean: number): number

  itemsDirectScore(correctMatrix: number[][]): number[]
  itemsMean(correctMatrix: number[][]): number[]
  itemsVariance(correctMatrix: number[][], itemsMean: number[]): number[]
  itemsDiscrimination(
    correctMatrix: number[][],
    usersDirectScore: number[],
  ): number[]
  itemsDifficulty(itemsDirectScore: number[], totalUsers: number): number[]
  itemsCorrDiscrimination(
    itemsDiscrimination: number[],
    itemsVariance: number[],
    variance: number,
  ): number[]
  itemsAltDiscDiff(
    usersDirectScore: number[],
    matrix: string[][],
    numAlternatives: number,
  ): [Map<string, number[]>, Map<string, number[]>]
  itemsConflict(
    alternativeDiscrimination: Map<string, number[]>,
    itemDiscrimination: number[],
  ): boolean[]
  itemsChoice(
    keys: string[],
    alternatives: number,
    alternativeDifficulty: Map<string, number[]>,
    numUsers: number,
    numItems: number,
  ): boolean[]

  weightScore(
    correctMatrix: number[][],
    itemsDiscrimination: number[],
  ): number[]
  standardDeviation(variance: number): number
  alpha(
    correctMatrix: number[][],
    itemsVariance: number[],
    variance: number,
  ): number
  sem(alpha: number, standardDeviation: number): number
  reliability(alpha: number): number
  discrimination(itemsDiscrimination: number[]): number
  keyConflict(itemsConflict: boolean[]): number
  choice(itemsChoice: boolean[]): number
  mci(
    correctMatrix: number[][],
    itemsDifficulty: number[],
    directScore: number[],
  ): number[]
  coherency(mci: number[]): number
  difficulty(itemsDifficulty: number[]): number
  // test health
}
