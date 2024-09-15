export function calculateMean(directScore: number[]): number {
  const length = directScore.length
  if (length === 0) {
    return 0
  }
  let sum = 0
  for (const value of directScore) {
    sum += value
  }
  return sum / length
}
