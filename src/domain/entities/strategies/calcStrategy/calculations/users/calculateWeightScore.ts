export function calculateWeightScore(correctMatrix: number[][], itemsDiscrimination: number[]): number[] {
  const weightScore: number[] = []

  for (const vector of correctMatrix) {
    const puntuacionSujeto = vector.reduce((acumulado, valor, indice) => {
      return acumulado + (valor === 0 ? 0 : itemsDiscrimination[indice])
    }, 0)

    weightScore.push(puntuacionSujeto)
  }
  return weightScore
}
