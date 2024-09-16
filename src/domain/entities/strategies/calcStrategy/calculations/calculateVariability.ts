export function calculateVariability(itemsVariance: number[], alternatives: number): number {
  const variability = alternatives / 10
  return itemsVariance.reduce((acc, r) => acc + (r > variability ? 1 : 0), 0) / itemsVariance.length
}
