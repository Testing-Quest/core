export function calculateCoherency(mci: number[]): number {
  return mci.filter(value => value < 0.5).length / mci.length
}
