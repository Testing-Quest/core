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
  let start = data[0].findIndex(v => typeof v === 'string' && v !== '')
  let end = data[0].length

  const keys: string[] = []
  const scales: number[] = []
  const alternatives: number[] = []

  for (let i = start; i < data[0].length; i++) {
    const key = data[0][i]
    const scale = data[1][i]
    const alternative = data[2][i]

    if (key === null || key === '') {
      end = i
      break
    }

    keys.push(String(key).trim())

    if (scale !== null) {
      scales.push(Number(scale))
    }

    if (alternative !== null) {
      alternatives.push(Number(alternative))
    }
  }

  // Detener la matriz cuando se encuentra una lista vacía
  const matrix: (number | string | null)[][] = []
  for (let row of data.slice(3)) {
    const trimmedRow = row.slice(start, end).map(cell => (typeof cell === 'string' ? cell.trim() : cell))
    if (trimmedRow.length === 0 || trimmedRow.every(cell => cell === null || cell === '')) {
      break
    }
    matrix.push(trimmedRow)
  }

  return { keys, scales, alternatives, matrix }
}

function validate(quest: Quest): void {
  if (quest.matrix.length === 0) {
    throw new MatrixNotFoundError()
  }
  const columnCount = quest.matrix[0].length

  if (columnCount !== quest.keys.length) {
    throw new ColumnCountMismatchKeysError()
  }
  if (quest.keys.some(key => !/^[A-Za-z+ -]+$/.test(key))) {
    console.log(quest.keys)
    throw new FirstRowNotContainsAlphabeticCharactersError()
  }
  if (quest.scales.some(cell => isNaN(Number(cell)))) {
    throw new SecondRowNotContainsNumbersError()
  }
  if (quest.alternatives.some(cell => isNaN(Number(cell)))) {
    console.log(columnCount)
    console.log(quest.alternatives)
    throw new ThirdRowNotContainsNumbersError()
  }
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
  const quest = parseInitialData(data)
  validate(quest)
  return generateQuestsData(quest)
}

export default loadQuest
