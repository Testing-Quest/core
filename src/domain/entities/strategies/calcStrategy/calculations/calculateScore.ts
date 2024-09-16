export function calculateScore(correctMatrix: number[][]): number {
  const numUsers = correctMatrix.length
  const numItems = correctMatrix[0].length
  return correctMatrix.reduce((acc, r) => acc + r.reduce((acc, value) => acc + value, 0), 0) / (numUsers * numItems)
}
