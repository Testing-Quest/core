export function calculateMCI(correctMatrix: number[][], itemsDifficulty: number[], directScore: number[]): number[] {
  const numFilas: number = correctMatrix.length
  const numColumnas: number = correctMatrix[0].length

  const puntuaciones: number[] = new Array(numFilas).fill(0) as number[]

  for (let i = 0; i < numFilas; i++) {
    for (let j = 0; j < numColumnas; j++) {
      puntuaciones[i] += correctMatrix[i][j] * itemsDifficulty[j]
    }
  }

  const columnasOrdenadas: number[] = [...Array(numColumnas).keys()].sort(
    (a, b) => itemsDifficulty[b] - itemsDifficulty[a],
  )

  const mciArray = []

  for (let i = 0; i < numFilas; i++) {
    const totalAciertos: number = directScore[i]
    const pautaTotalmenteCorrecta: number = columnasOrdenadas
      .slice(0, totalAciertos)
      .reduce((suma, idx) => suma + itemsDifficulty[idx], 0)
    const pautaTotalmenteIncorrecta: number = columnasOrdenadas
      .slice(numColumnas - totalAciertos, numColumnas)
      .reduce((suma, idx) => suma + itemsDifficulty[idx], 0)
    const pautaObservada: number = puntuaciones[i]

    const numerador: number = pautaTotalmenteCorrecta - pautaObservada
    const denominador: number = pautaTotalmenteCorrecta - pautaTotalmenteIncorrecta

    const mci: number = denominador !== 0 ? numerador / denominador : 0
    mciArray.push(mci)
  }
  return mciArray
}
