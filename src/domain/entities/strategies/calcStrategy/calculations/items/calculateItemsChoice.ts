const dictChiSqr = new Map<number, number>([
  [3, 5.99],
  [4, 7.81],
  [5, 9.48],
  [6, 11.07],
  [7, 12.59],
  [8, 14.07],
  [9, 15.51],
  [10, 16.92],
])

export function calculateItemsChoice(
  keys: string[],
  alternatives: number,
  alternativeDifficulty: Map<string, number[]>,
  numUsers: number,
  numItems: number,
): boolean[] {
  const choice: boolean[] = []

  const frequencies = new Map<string, number[]>()

  for (const [difficulty, freqs] of alternativeDifficulty) {
    frequencies.set(
      difficulty,
      Array.from(freqs, freq => freq * numUsers),
    )
  }

  const getFrequencies = (key: string, index: number) => {
    const result: number[] = []
    for (const [difficulty, freqs] of frequencies) {
      if (difficulty !== 'Difficulty X' && difficulty !== `Difficulty ${key}`) {
        result.push(freqs[index])
      }
    }
    return result
  }

  const calculateChiCuadrado = (itemFrequencies: number[], freqEsperada: number): number => {
    return itemFrequencies.reduce((acc, freq) => acc + Math.pow(freq - freqEsperada, 2) / freqEsperada, 0)
  }

  for (let i = 0; i < numItems; i++) {
    const itemKey: string = keys[i]
    const itemFrequencies: number[] = getFrequencies(itemKey, i)
    const numRespuestas: number = itemFrequencies.reduce((a, b) => a + b, 0)

    const freqEsperada: number = numRespuestas / (alternatives - 1)

    const chiCuadrado: number = calculateChiCuadrado(itemFrequencies, freqEsperada)

    choice.push(chiCuadrado < dictChiSqr.get(alternatives - 1)!)
  }
  return choice
}
