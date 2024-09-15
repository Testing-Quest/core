export function calculateChoice(itemsChoice: boolean[]): number {
  return itemsChoice.filter(value => value).length / itemsChoice.length
}
