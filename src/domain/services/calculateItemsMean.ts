export default function calculateItemsMean(matrix: number[][]): number[] {

  return Array.from({ length: matrix[0].length }, (_, j) => {
    return matrix.reduce((acc, row) => acc + row[j], 0) / matrix.length;
  });
}
