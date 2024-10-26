export function calculateScore(correctMatrix: number[][]): number {
  const numUsers = correctMatrix.length
  const numItems = correctMatrix[0].length
  return (
    correctMatrix.reduce((accOne, r) => accOne + r.reduce((accTwo, value) => accTwo + value, 0), 0) /
    (numUsers * numItems)
  )
}
