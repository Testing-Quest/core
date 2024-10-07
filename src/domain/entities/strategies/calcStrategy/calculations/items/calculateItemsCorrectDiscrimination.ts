export function calculateItemsCorrectDiscrimination(
  itemDiscrimination: number[],
  itemsVariance: number[],
  variance: number,
): number[] {
  return itemDiscrimination.map((discrimination, i) => {
    const numerator = discrimination * variance - itemsVariance[i]
    const denominator = Math.sqrt(
      variance ** 2 + itemsVariance[i] ** 2 - 2 * discrimination * variance * itemsVariance[i],
    )
    return numerator / denominator
  })
}
