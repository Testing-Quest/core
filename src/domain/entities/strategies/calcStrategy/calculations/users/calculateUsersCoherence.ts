import { calculatePearson } from '../calculatePearson'

export function calculateUsersCoherence(correctMatrix: number[][]): number[] {
  const rows = correctMatrix.length
  const cols = correctMatrix[0].length
  const coherence = new Array(rows)
  const avgPunctuation = new Array(cols)
  const colSums = new Array(cols).fill(0)

  // Calculate column sums and average punctuation in one pass
  for (let i = 0; i < rows; i++) {
    const row = correctMatrix[i]
    for (let j = 0; j < cols; j++) {
      colSums[j] += row[j]
    }
  }

  for (let j = 0; j < cols; j++) {
    avgPunctuation[j] = colSums[j] / rows
  }

  // Calculate coherence for each row using calculatePearson
  for (let i = 0; i < rows; i++) {
    coherence[i] = calculatePearson(correctMatrix[i], avgPunctuation)
  }

  return coherence
}
