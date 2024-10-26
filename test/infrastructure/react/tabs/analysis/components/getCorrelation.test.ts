import { getCorrelation } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/getCorrelation'

describe('getCorrelation', () => {
  it('returns N/A for undefined data', () => {
    expect(getCorrelation(undefined)).toBe('N/A')
  })

  it('calculates correlation correctly for simple dataset', () => {
    const data = [
      { x: 1, y: 1, hover: 1 },
      { x: 2, y: 2, hover: 2 },
      { x: 3, y: 3, hover: 3 },
    ]
    expect(getCorrelation(data)).toBe('1.00')
  })

  it('calculates correlation correctly for inverse correlation', () => {
    const data = [
      { x: 3, y: 1, hover: 1 },
      { x: 2, y: 2, hover: 2 },
      { x: 1, y: 3, hover: 3 },
    ]
    expect(getCorrelation(data)).toBe('-1.00')
  })

  it('handles zero correlation', () => {
    const data = [
      { x: 1, y: 1, hover: 1 },
      { x: 2, y: 2, hover: 2 },
      { x: 3, y: 1, hover: 3 },
    ]
    expect(parseFloat(getCorrelation(data))).toBeLessThan(1)
  })
})
