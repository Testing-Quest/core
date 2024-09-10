export default function calculateItemsDirectScore(matrix: number[][]): number[] {
  const cols = matrix[0].length;
  const result = new Array(cols).fill(0);

  for (const row of matrix) {
    for (let j = 0; j < cols; j++) {
      result[j] += row[j];
    }
  }

  return result;
}

