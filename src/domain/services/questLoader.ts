import {
  ColumnCountMismatchAlternativesError,
  ColumnCountMismatchKeysError,
  ColumnCountMismatchScalesError,
  FirstColumnNotContainsNumbersError,
  FirstColumnsThreeRowsNotEmptyError,
  FirstRowNotContainsAlphabeticCharactersError,
  MatrixNotFoundError,
  SecondRowNotContainsNumbersError,
  ThirdRowNotContainsNumbersError,
} from '../errors/loadErrors'
import type { NewQuestType } from '../primitives/quest'
import { v4 as uuidv4 } from 'uuid'

type Quest = {
  keys: string[]
  scales: number[]
  alternatives: number[]
  matrix: (number | string | null)[][]
}

function validateFirstThreeColumns(data: (number | string | null)[][]): void {
  const firstThreeColumns = [data[0][0], data[1][0], data[2][0]]
  const nonEmptyColumns = firstThreeColumns.filter(Boolean)
  if (nonEmptyColumns.length > 0 && nonEmptyColumns.length < 3) {
    throw new FirstColumnsThreeRowsNotEmptyError()
  }
}

function validateNumericRow(row: (number | string | null)[], error: Error): void {
  if (row.some(cell => isNaN(Number(cell)))) {
    throw error
  }
}
function validateMatrixDimensions(
  matrix: (number | string | null)[][],
  keys: string[],
  scales: number[],
  alternatives: number[],
): void {
  if (matrix.length === 0) {
    throw new MatrixNotFoundError()
  }

  const columnCount = matrix[0].length
  console.log(matrix)

  if (columnCount !== keys.length) {
    throw new ColumnCountMismatchKeysError()
  }
  if (columnCount !== scales.length) {
    throw new ColumnCountMismatchScalesError()
  }
  if (columnCount !== alternatives.length) {
    throw new ColumnCountMismatchAlternativesError()
  }
}

function validateAlphabeticKeys(keys: string[]): void {
  const alphabeticRegex = /^[A-Za-z+ -]+$/
  if (keys.some(key => !alphabeticRegex.test(key))) {
    throw new FirstRowNotContainsAlphabeticCharactersError()
  }
}

function cleanMatrix(matrix: (number | string | null)[][]): (number | string | null)[][] {
  return matrix.filter(row => row[0] !== undefined)
}

function cleanArray<T>(array: T[], condition: (item: T) => boolean): T[] {
  return array.filter(condition)
}

function prepareData(data: (number | string | null)[][]): {
  usersID: number[]
  keys: string[]
  scales: number[]
  alternatives: number[]
  matrix: (number | string | null)[][]
} {
  const [firstRow, secondRow, thirdRow] = data
  const firstThreeColumnsEmpty = [firstRow[0], secondRow[0], thirdRow[0]].every(cell => cell === undefined)

  let usersID: number[], keys: string[], scales: number[], alternatives: number[], matrix: (number | string | null)[][]

  if (firstThreeColumnsEmpty) {
    usersID = Array.from({ length: data.length - 3 }, (_, i) => i + 1)
    keys = firstRow.map(cell => (cell as string).trim())
    scales = secondRow.map(Number)
    alternatives = thirdRow.map(Number)
    matrix = data.slice(3).map(row => row.slice(1))
  } else {
    usersID = Array.from({ length: data.length }, (_, i) => i + 1)
    keys = firstRow.slice(1).map(cell => (cell as string).trim())
    scales = secondRow.slice(1).map(Number)
    alternatives = thirdRow.slice(1).map(Number)
    matrix = data.slice(3).map(row => row.slice(1))
  }

  matrix = cleanMatrix(matrix)
  usersID = cleanArray(usersID, user => !isNaN(user))
  keys = cleanArray(keys, key => !!key)
  scales = cleanArray(scales, scale => !isNaN(scale))
  alternatives = cleanArray(alternatives, alt => !isNaN(alt))

  if (matrix.length !== usersID.length) {
    throw new FirstColumnNotContainsNumbersError()
  }

  return { usersID, keys, scales, alternatives, matrix }
}

function generateQuestsData({ keys, scales, alternatives, matrix }: Quest): NewQuestType[] {
  const uniqueScales = Array.from(new Set(scales))
  return uniqueScales.map(scale => {
    const matchingIndexes = scales.reduce<number[]>((indexes, currentScale, i) => {
      if (currentScale === scale) indexes.push(i)
      return indexes
    }, [])

    const filteredMatrix = matrix.map(row =>
      matchingIndexes.map(i => (typeof row[i] === 'string' ? row[i].trim() : row[i])),
    )
    const filteredKeys = matchingIndexes.map(i => keys[i])
    const filteredAlternatives = matchingIndexes.map(i => alternatives[i])

    const type =
      filteredKeys[0].startsWith('+') || filteredKeys[0].startsWith('-')
        ? 'gradu'
        : filteredAlternatives[0] > 2
          ? 'multi'
          : 'binary'

    return {
      uuid: uuidv4(),
      keys: filteredKeys,
      scale,
      alternatives: filteredAlternatives[0],
      matrix: filteredMatrix,
      type,
    }
  })
}

async function loadQuest(data: (number | string | null)[][]): Promise<NewQuestType[]> {
  validateFirstThreeColumns(data)
  validateNumericRow(data[1].slice(1), new SecondRowNotContainsNumbersError())
  validateNumericRow(data[2].slice(1), new ThirdRowNotContainsNumbersError())

  const { keys, scales, alternatives, matrix } = prepareData(data)

  validateMatrixDimensions(matrix, keys, scales, alternatives)
  validateAlphabeticKeys(keys)

  return generateQuestsData({ keys, scales, alternatives, matrix })
}

export default loadQuest
