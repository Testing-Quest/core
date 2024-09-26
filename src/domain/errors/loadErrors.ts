export class FirstColumnsThreeRowsNotEmptyError extends Error {
  constructor() {
    super('The first three rows of the first columns must be empty')
  }
}

export class FirstRowNotContainsAlphabeticCharactersError extends Error {
  constructor() {
    super('The first row must contain alphabetic characters [A-z] or [+ -]')
  }
}

export class SecondRowNotContainsNumbersError extends Error {
  constructor() {
    super('The second row must contain numbers')
  }
}

export class ThirdRowNotContainsNumbersError extends Error {
  constructor() {
    super('The third row must contain numbers')
  }
}

export class FirstColumnNotContainsNumbersError extends Error {
  constructor() {
    super('The first column must contain numbers')
  }
}

export class ColumnCountMismatchKeysError extends Error {
  constructor() {
    super('Matrix column count does not match the number of keys')
  }
}

export class ColumnCountMismatchScalesError extends Error {
  constructor() {
    super('Matrix column count does not match the number of scales')
  }
}

export class ColumnCountMismatchAlternativesError extends Error {
  constructor() {
    super('Matrix column count does not match the number of alternatives')
  }
}
