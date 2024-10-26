export function calculateCronbachAlpha(correctMatrix: number[][], itemsVariance: number[], variance: number): number {
  const nItems = correctMatrix[0].length
  const itemVar = itemsVariance.reduce((acc, value) => acc + value, 0)

  if (nItems > 1) {
    return (nItems / (nItems - 1)) * (1 - itemVar / variance)
  } else {
    return 0
  }
}
