import { allAlternatives } from '../../../../../primitives'
import { calculatePearson } from '../calculatePearson'

export function calculateItemsAlternativeDiscriminationDifficulty(
  usersDirectScore: number[],
  matrix: string[][],
  numAlternatives: number,
): [Map<string, number[]>, Map<string, number[]>] {
  const numUsers = usersDirectScore.length

  const alternativeDiscrimination = new Map<string, number[]>()
  const alternativeDifficulty = new Map<string, number[]>()

  const calculateDisrimination = (discMatrix: number[][]): number[] => {
    return Array.from({ length: discMatrix[0].length }, (_, i) => {
      const item = discMatrix.map(row => row[i])
      return calculatePearson(item, usersDirectScore)
    })
  }

  const calculateDifficulty = (directScore: number[]): number[] => directScore.map(item => item / numUsers)

  const processAlternative = (alternative: string): void => {
    const correctedMatrix = matrix.map(row => row.map(item => +(item === alternative)))
    const itemsDirectScore = Array.from({ length: numUsers }, (_, colIndex) =>
      correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0),
    )

    alternativeDiscrimination.set(`Discrimination ${alternative}`, calculateDisrimination(correctedMatrix))
    alternativeDifficulty.set(`Difficulty ${alternative}`, calculateDifficulty(itemsDirectScore))
  }

  for (let i = 0; i < numAlternatives; i++) {
    const alternative = allAlternatives[i]
    processAlternative(alternative)
  }
  processAlternative('X')

  return [alternativeDiscrimination, alternativeDifficulty]
}
export function calculateBinaryAlternativeDifficulty(
  correctMatrix: number[][],
  alternatives: number,
): Map<string, number[]> {
  const alternativeDifficulty = new Map<string, number[]>()

  const processAlternative = (alternative: number): void => {
    const difficulty = Array.from(
      { length: correctMatrix[0].length },
      (_, colIndex) =>
        correctMatrix.reduce((acc, row) => acc + (row[colIndex] === alternative ? 1 : 0), 0) / correctMatrix.length,
    )

    alternativeDifficulty.set(`Difficulty ${alternative}`, difficulty)
  }

  for (let i = 0; i <= alternatives; i++) {
    processAlternative(i)
  }
  return alternativeDifficulty
}
