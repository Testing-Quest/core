import {
  ColumnCountMismatchKeysError,
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

function parseInitialData(data: (number | string | null)[][]): Quest {
  let start = data[0].findIndex(v => typeof v === 'string' && v.trim() !== ''),
    end = data[0].length

  const keys: string[] = [],
    scales: number[] = [],
    alternatives: number[] = []

  for (let i = start; i < end; i++) {
    const key = data[0][i],
      scale = data[1][i],
      alternative = data[2][i]
    if (!key) {
      end = i
      break
    }
    keys.push(String(key).trim())
    if (scale !== null) scales.push(Number(scale))
    if (alternative !== null) alternatives.push(Number(alternative))
  }

  const matrix = data.slice(3).reduce<(number | string | null)[][]>((acc, row) => {
    const trimmedRow = row.slice(start, end).map(cell => (typeof cell === 'string' ? cell.trim() : cell))
    if (trimmedRow.every(cell => cell === null || cell === '')) return acc
    acc.push(trimmedRow)
    return acc
  }, [])

  return { keys, scales, alternatives, matrix }
}

function validate({ keys, scales, alternatives, matrix }: Quest): void {
  if (!matrix.length) throw new MatrixNotFoundError()
  if (matrix[0].length !== keys.length) throw new ColumnCountMismatchKeysError()
  if (keys.some(k => !/^[A-Za-z+ -]+$/.test(k))) throw new FirstRowNotContainsAlphabeticCharactersError()
  if (scales.some(isNaN)) throw new SecondRowNotContainsNumbersError()
  if (alternatives.some(isNaN)) throw new ThirdRowNotContainsNumbersError()
}

function generateQuestsData({ keys, scales, alternatives, matrix }: Quest): NewQuestType[] {
  return Array.from(new Set(scales)).map(scale => {
    const matchingIndexes = scales.reduce<number[]>((acc, s, i) => (s === scale ? [...acc, i] : acc), [])

    const filteredMatrix = matrix.map(row => matchingIndexes.map(i => row[i])),
      filteredKeys = matchingIndexes.map(i => keys[i]),
      filteredAlternatives = matchingIndexes.map(i => alternatives[i])

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
  const quest = parseInitialData(data)
  validate(quest)
  return generateQuestsData(quest)
}

export default loadQuest
