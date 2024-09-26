export class FirstColumnsThreeRowsNotEmptyError extends Error {
  public static message = 'The first three rows of the first columns must be empty'
  constructor() {
    super(FirstColumnsThreeRowsNotEmptyError.message)
  }
}

export class FirstRowNotContainsAlphabeticCharactersError extends Error {
  public static message = 'The first row must contain alphabetic characters [A-z] or [+ -]'
  constructor() {
    super(FirstRowNotContainsAlphabeticCharactersError.message)
  }
}

export class SecondRowNotContainsNumbersError extends Error {
  public static message = 'The second row must contain numbers'
  constructor() {
    super(SecondRowNotContainsNumbersError.message)
  }
}

export class ThirdRowNotContainsNumbersError extends Error {
  public static message = 'The third row must contain numbers'
  constructor() {
    super(ThirdRowNotContainsNumbersError.message)
  }
}

export class FirstColumnNotContainsNumbersError extends Error {
  public static message = 'The first column must contain numbers'
  constructor() {
    super(FirstColumnNotContainsNumbersError.message)
  }
}

export class ColumnCountMismatchKeysError extends Error {
  public static message = 'Matrix column count does not match the number of keys'
  constructor() {
    super(ColumnCountMismatchKeysError.message)
  }
}

export class ColumnCountMismatchScalesError extends Error {
  public static message = 'Matrix column count does not match the number of scales'
  constructor() {
    super(ColumnCountMismatchScalesError.message)
  }
}

export class ColumnCountMismatchAlternativesError extends Error {
  public static message = 'Matrix column count does not match the number of alternatives'
  constructor() {
    super(ColumnCountMismatchAlternativesError.message)
  }
}

export class MatrixNotFoundError extends Error {
  public static message = 'Matrix does not exists on the given file'
  constructor() {
    super(MatrixNotFoundError.message)
  }
}
