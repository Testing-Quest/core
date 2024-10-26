import { allAlternatives } from '../../../../primitives'
import { MatrixType } from '../../../../primitives/quest'

export function calculateAltFrequencies(matrix: MatrixType, numAlternatives: number): Record<string, number> {
  const alternatives = [...allAlternatives.slice(0, numAlternatives), 'X']
  const altFrequencies: Record<string, number> = Object.fromEntries(alternatives.map(alt => [alt, 0]))

  matrix.forEach(row => {
    row.forEach(response => {
      if (alternatives.includes(String(response).trim())) {
        altFrequencies[String(response)]++
      } else {
        altFrequencies['X']++
      }
    })
  })

  return altFrequencies
}

export function calculateGraduAltFrequencies(matrix: MatrixType): Record<string, number> {
  const altFrequencies: Record<string, number> = {
    '-': 0,
    '+': 0,
    X: 0,
  }

  matrix.forEach(row => {
    row.forEach(response => {
      if (['-', '+', 'X'].includes(String(response).trim())) {
        altFrequencies[String(response).trim()]++
      } else {
        altFrequencies['X']++
      }
    })
  })

  return altFrequencies
}
