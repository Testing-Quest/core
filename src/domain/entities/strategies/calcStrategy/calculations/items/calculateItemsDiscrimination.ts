import { calculatePearson } from '../calculatePearson'

export function calculateItemsDiscrimination(corrMatrix: number[][], usersDirectScore: number[]): number[] {
  return Array.from({ length: corrMatrix[0].length }, (_, j) => {
    const userScores = corrMatrix.map(row => row[j])
    return calculatePearson(userScores, usersDirectScore)
  })
}
