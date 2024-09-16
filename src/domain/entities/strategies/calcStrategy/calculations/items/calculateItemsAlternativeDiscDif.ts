import { calculatePearson } from '../calculatePearson'

const Alternatives: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
]

export function calculateItemsAlternativeDiscriminationDifficulty(
  usersDirectScore: number[],
  matrix: string[][],
  numAlternatives: number,
): [Map<string, number[]>, Map<string, number[]>] {
  const numUsers = usersDirectScore.length

  const alternativeDiscrimination = new Map<string, number[]>()
  const alternativeDifficulty = new Map<string, number[]>()

  const calculateDisrimination = (matrix: number[][]) => {
    return Array.from({ length: matrix[0].length }, (_, i) => {
      const item = matrix.map(row => row[i])
      return calculatePearson(item, usersDirectScore)
    })
  }

  const calculateDifficulty = (directScore: number[]) => directScore.map(item => item / numUsers)

  const processAlternative = (alternative: string) => {
    const correctedMatrix = matrix.map(row => row.map(item => +(item === alternative)))
    const itemsDirectScore = Array.from({ length: numUsers }, (_, colIndex) =>
      correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0),
    )

    alternativeDiscrimination.set(`Discrimination ${alternative}`, calculateDisrimination(correctedMatrix))
    alternativeDifficulty.set(`Difficulty ${alternative}`, calculateDifficulty(itemsDirectScore))
  }

  for (let i = 0; i < numAlternatives; i++) {
    const alternative = Alternatives[i]
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

  const processAlternative = (alternative: number) => {
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
