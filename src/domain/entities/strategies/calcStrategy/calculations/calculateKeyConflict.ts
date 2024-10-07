export function calculateKeyConflict(itemsConflict: boolean[]): number {
  return 1 - itemsConflict.filter(value => value).length / itemsConflict.length
}
