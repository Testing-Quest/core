export class FirstColumnsThreeRowsNotEmptyError extends Error {
  constructor() {
    console.log('FirstColumnsThreeRowsNotEmptyError');
    super('The first three rows of the first columns must be empty');
  }
}

export class FirstRowNotContainsAlphabeticCharactersError extends Error {
  constructor() {
    console.log('FirstRowNotContainsAlphabeticCharactersError');
    super('The first row must contain alphabetic characters [A-z] or [+ -]');
  }
}

export class SecondRowNotContainsNumbersError extends Error {
  constructor() {
    console.log('SecondRowNotContainsNumbersError');
    super('The second row must contain numbers');
  }
}

export class ThirdRowNotContainsNumbersError extends Error {
  constructor() {
    console.log('ThirdRowNotContainsNumbersError');
    super('The third row must contain numbers');
  }
}

export class FirstColumnNotContainsNumbersError extends Error {
  constructor() {
    console.log('FirstColumnNotContainsNumbersError');
    super('The first column must contain numbers');
  }
}

export class ColumnCountMismatchKeysError extends Error {
  constructor() {
    console.log('ColumnCountMismatchKeysError');
    super('Matrix column count does not match the number of keys');
  }
}

export class ColumnCountMismatchScalesError extends Error {
  constructor() {
    console.log('ColumnCountMismatchScalesError');
    super('Matrix column count does not match the number of scales');
  }
}

export class ColumnCountMismatchAlternativesError extends Error {
  constructor() {
    console.log('ColumnCountMismatchAlternativesError');
    super('Matrix column count does not match the number of alternatives');
  }
}
