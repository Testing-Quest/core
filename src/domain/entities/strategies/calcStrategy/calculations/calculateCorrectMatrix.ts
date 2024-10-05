import type { MatrixType } from '../../../../primitives/quest'

export function calculateChoiceCorrectMatrix(matrix: MatrixType, keys: string[]): number[][] {
  const numRows = matrix.length
  const numCols = keys.length
  const correctedMatrix: number[][] = new Array(numRows) as number[][]

  for (let i = 0; i < numRows; i++) {
    const row = matrix[i]
    const correctedRow = new Array(numCols) as number[]
    for (let j = 0; j < numCols; j++) {
      correctedRow[j] = row[j] === keys[j] ? 1 : 0
    }
    correctedMatrix[i] = correctedRow
  }
  return correctedMatrix
}

export function calculateGraduCorrectMatrix(matrix: MatrixType, keys: string[], alternatives: number): number[][] {
  return matrix.map(row =>
    row.map((answer: number | string | null, columnIndex: number) => {
      const newAnswer = Number(answer)
      if (isNaN(newAnswer)) {
        return 0
      }
      if (keys[columnIndex] === '-' && newAnswer != 0 && newAnswer <= alternatives) {
        return alternatives - newAnswer + 1
      }
      return newAnswer
    }),
  )
}
