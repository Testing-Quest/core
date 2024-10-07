export function calculateItemsDifficulty(itemsDirectScore: number[], totalUsers: number): number[] {
  const difficulty = new Array(itemsDirectScore.length)
  const totalUsersInv = 1 / totalUsers

  for (let i = 0; i < itemsDirectScore.length; i++) {
    difficulty[i] = itemsDirectScore[i] * totalUsersInv
  }

  return difficulty
}
