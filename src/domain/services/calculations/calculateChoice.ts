export function calculateChoice(itemsChoice: boolean[]): number {
  return itemsChoice.filter(value => value === true).length / itemsChoice.length;
}
