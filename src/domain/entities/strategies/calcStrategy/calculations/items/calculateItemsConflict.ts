export function calculateItemsConflict(
  alternativeDiscriminationMap: Map<string, number[]>,
  itemDiscrimination: number[],
): boolean[] {
  const alternativeDiscriminations = Array.from(alternativeDiscriminationMap.values())
  return itemDiscrimination.map((itemDisc, i) => itemDisc != Math.max(...alternativeDiscriminations.map(arr => arr[i])))
}
