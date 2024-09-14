type Primitives = string | number;

export function calculateUsersBlankAnswers<T extends Primitives>(matrix: T[][], omissions: T[]): number[] {
  const result = new Array(matrix.length);
  const omissionSet = new Set(omissions);
  const rowLength = matrix[0].length;
  const invRowLength = 1 / rowLength;

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    let blankCount = 0;
    for (let j = 0; j < rowLength; j++) {
      if (omissionSet.has(row[j])) {
        blankCount++;
      }
    }
    result[i] = blankCount === 0 ? 0 : blankCount * invRowLength;
  }

  return result;
}
