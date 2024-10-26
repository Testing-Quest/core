import 'jest-extended'

declare global {
  namespace jest {
    /* eslint-disable @typescript-eslint/consistent-type-definitions */
    interface Matchers<R> {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      toEqualWithRounding(expected: any): R
    }
  }
}
