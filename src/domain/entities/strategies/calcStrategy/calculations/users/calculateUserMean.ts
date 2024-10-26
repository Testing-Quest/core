export function calculateUserMean(directScore: number[], totalItems: number): number[] {
  const mean = new Array(directScore.length)
  const totalItemsInv = 1 / totalItems

  for (let i = 0; i < directScore.length; i++) {
    mean[i] = directScore[i] * totalItemsInv
  }

  return mean
}
