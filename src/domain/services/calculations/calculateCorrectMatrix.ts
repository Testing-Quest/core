type Primitives = string | number;

export function calculateCorrectMatrix<T extends Primitives>(matrix: T[][], keys: T[]): number[][] {
  const numRows = matrix.length;
  const numCols = keys.length;
  const correctedMatrix: number[][] = new Array(numRows);

  for (let i = 0; i < numRows; i++) {
    const row = matrix[i];
    const correctedRow = new Array(numCols);
    for (let j = 0; j < numCols; j++) {
      correctedRow[j] = row[j] === keys[j] ? 1 : 0;
    }
    correctedMatrix[i] = correctedRow;
  }

  return correctedMatrix;
}
