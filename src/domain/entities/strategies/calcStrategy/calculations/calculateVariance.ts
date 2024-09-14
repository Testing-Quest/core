export function calculateVariance(directScore: number[], mean: number): number {
  const length = directScore.length;
  if (length === 0) {
    return 0;
  }

  let sumOfSquares = 0;
  for (const score of directScore) {
    const deviation = score - mean;
    sumOfSquares += deviation * deviation;
  }

  return sumOfSquares / length;
}

