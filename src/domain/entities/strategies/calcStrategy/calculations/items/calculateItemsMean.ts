export function calculateItemsMean(correctMatrix: number[][]): number[] {
  return Array.from({ length: correctMatrix[0].length }, (_, j) => {
    return correctMatrix.reduce((acc, row) => acc + row[j], 0) / correctMatrix.length
  })
}
