export function calculateDifficulty(itemsDifficulty: number[]): number {
  return itemsDifficulty.reduce((acc, value) => acc + value, 0) / itemsDifficulty.length
}
