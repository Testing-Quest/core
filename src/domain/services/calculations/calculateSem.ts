
export default function calculateSEM(
  cronbachAlpha: number,
  standardDeviation: number
): number {
  return standardDeviation * Math.sqrt(1 - cronbachAlpha);
}
