import 'jest-extended'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualWithRounding(expected: any): R
    }
  }
}
