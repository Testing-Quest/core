export const roundToFourDecimals = (num: number): number => {
  return Math.round(num * 10000) / 10000
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deepCompareWithRounding = (actual: any, expected: any): boolean => {
  if (typeof actual !== typeof expected) {
    return false
  }

  if (typeof actual === 'number') {
    return roundToFourDecimals(actual) === roundToFourDecimals(expected)
  }

  if (Array.isArray(actual)) {
    return (
      Array.isArray(expected) &&
      actual.length === expected.length &&
      actual.every((item, index) => deepCompareWithRounding(item, expected[index]))
    )
  }

  if (typeof actual === 'object' && actual !== null) {
    const actualKeys = Object.keys(actual)
    const expectedKeys = Object.keys(expected)

    return (
      actualKeys.length === expectedKeys.length &&
      actualKeys.every(key => deepCompareWithRounding(actual[key], expected[key]))
    )
  }

  return actual === expected
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const toEqualWithRounding = (received: any, expected: any) => {
  const pass = deepCompareWithRounding(received, expected)
  if (pass) {
    return {
      message: () => `expected ${received} not to equal ${expected} when rounded to 4 decimal places`,
      pass: true,
    }
  } else {
    return {
      message: () => `expected ${received} to equal ${expected} when rounded to 4 decimal places`,
      pass: false,
    }
  }
}
