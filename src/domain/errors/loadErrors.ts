export class FirstRowNotContainsAlphabeticCharactersError extends Error {
  public static message = 'The first row (keys) must contain alphabetic characters [A-z] or [+ -]'
  constructor() {
    super(FirstRowNotContainsAlphabeticCharactersError.message)
  }
}

export class SecondRowNotContainsNumbersError extends Error {
  public static message = 'The second row (scales) must contain numbers'
  constructor() {
    super(SecondRowNotContainsNumbersError.message)
  }
}

export class ThirdRowNotContainsNumbersError extends Error {
  public static message = 'The third row (alternatives) must contain numbers'
  constructor() {
    super(ThirdRowNotContainsNumbersError.message)
  }
}

export class ColumnCountMismatchKeysError extends Error {
  public static message = 'Matrix column count does not match the number of keys'
  constructor() {
    super(ColumnCountMismatchKeysError.message)
  }
}

export class MatrixNotFoundError extends Error {
  public static message = 'Matrix does not exists on the given file'
  constructor() {
    super(MatrixNotFoundError.message)
  }
}
