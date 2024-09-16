export function calculateItemsConflict(
  alternativeDiscriminationMap: Map<string, number[]>,
  itemDiscrimination: number[],
): boolean[] {
  const alternativeDiscrimination = Array.from(alternativeDiscriminationMap.values())
  return itemDiscrimination.map((value, index) => {
    const alternativeDiscriminationItem: number[] = alternativeDiscrimination.map(row => row[index])
    return value > Math.max(...alternativeDiscriminationItem)
  })
}
