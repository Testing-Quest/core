export function calculateDiscrimination(itemsDiscrimination: number[]): number {
  return itemsDiscrimination.filter(value => value > 0.3).length / itemsDiscrimination.length
}
