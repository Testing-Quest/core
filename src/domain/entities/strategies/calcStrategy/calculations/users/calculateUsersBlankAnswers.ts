import type { MatrixType } from '../../../../../primitives/quest'

export function calculateUsersBlankAnswers(matrix: MatrixType, omissions: (string | number)[]): number[] {
  const result = new Array(matrix.length)
  const omissionSet = new Set(omissions)
  const rowLength = matrix[0].length
  const invRowLength = 1 / rowLength

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i]
    let blankCount = 0
    for (let j = 0; j < rowLength; j++) {
      if (!row[j] || omissionSet.has(String(row[j])) || (Number(row[j]) && isNaN(Number(row[j])))) {
        blankCount++
      }
    }
    result[i] = blankCount === 0 ? 0 : blankCount * invRowLength
  }

  return result
}
