export function calculateItemsVariance(correctMatrix: number[][], itemsMean: number[]): number[] {
  return Array.from(
    { length: correctMatrix[0].length },
    (_, colIndex) =>
      correctMatrix.reduce((acc, row) => acc + (row[colIndex] - itemsMean[colIndex]) ** 2, 0) /
      (correctMatrix.length - 1),
  )
}
