export default function calculateUsersDirectScore(matrix: number[][]): number[] {
  const numRows = matrix.length;
  const scores = new Array(numRows);

  for (let i = 0; i < numRows; i++) {
    const row = matrix[i];
    let sum = 0;
    const numCols = row.length;
    for (let j = 0; j < numCols; j++) {
      sum += row[j];
    }
    scores[i] = sum;
  }
  return scores;
}

