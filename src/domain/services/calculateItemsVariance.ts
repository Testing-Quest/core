export default function calculateItemsVariance(matrix: number[][], mean: number[]): number[] {
  return Array.from({ length: matrix[0].length }, (_, colIndex) =>
			matrix.reduce((acc, row) => acc + (row[colIndex] - mean[colIndex]) ** 2, 0) / (matrix.length - 1)
		);

}
