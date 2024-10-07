export function calculateItemsDirectScore(correctMatrix: number[][]): number[] {
  const cols = correctMatrix[0].length
  const result = new Array(cols).fill(0)

  for (const row of correctMatrix) {
    for (let j = 0; j < cols; j++) {
      result[j] += row[j]
    }
  }

  return result
}
