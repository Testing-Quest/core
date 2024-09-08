import {
  ColumnCountMismatchAlternativesError,
  ColumnCountMismatchKeysError,
  ColumnCountMismatchScalesError,
  FirstColumnNotContainsNumbersError,
  FirstColumnsThreeRowsNotEmptyError,
  FirstRowNotContainsAlphabeticCharactersError,
  SecondRowNotContainsNumbersError,
  ThirdRowNotContainsNumbersError
} from "../errors/loadErrors";
import { QuestType } from "../quest";
import { v4 as uuidv4 } from 'uuid';

interface Quest {
  keys: string[];
  scales: number[];
  alternatives: number[];
  matrix: string[][];
}

function validateFirstThreeColumns(data: string[][]): void {
  const firstThreeColumns = [data[0][0], data[1][0], data[2][0]];
  const nonEmptyColumns = firstThreeColumns.filter(Boolean);
  if (nonEmptyColumns.length > 0 && nonEmptyColumns.length < 3) {
    throw new FirstColumnsThreeRowsNotEmptyError();
  }
}

function validateNumericRow(row: string[], error: Error): void {
  if (row.some(cell => isNaN(Number(cell)))) {
    throw error;
  }
}
function validateMatrixDimensions(matrix: string[][], keys: string[], scales: number[], alternatives: number[]): void {
  const columnCount = matrix[0].length;

  if (columnCount !== keys.length) { throw new ColumnCountMismatchKeysError() }
  if (columnCount !== scales.length) { throw new ColumnCountMismatchScalesError() }
  if (columnCount !== alternatives.length) { throw new ColumnCountMismatchAlternativesError() }
}

function validateAlphabeticKeys(keys: string[]): void {
  const alphabeticRegex = /^[A-Za-z+ -]+$/;
  if (keys.some(key => !alphabeticRegex.test(key))) {
    throw new FirstRowNotContainsAlphabeticCharactersError();
  }
}


function cleanMatrix(matrix: string[][]): string[][] {
  return matrix.filter(row => row[0] !== undefined);
}

function cleanArray<T>(array: T[], condition: (item: T) => boolean): T[] {
  return array.filter(condition);
}


function prepareData(data: string[][]): {
  usersID: number[],
  keys: string[],
  scales: number[],
  alternatives: number[],
  matrix: string[][]
} {
  const [firstRow, secondRow, thirdRow] = data;
  const firstThreeColumnsEmpty = [firstRow[0], secondRow[0], thirdRow[0]].every(cell => cell === undefined);

  let usersID: number[], keys: string[], scales: number[], alternatives: number[], matrix: string[][];

  if (firstThreeColumnsEmpty) {
    usersID = Array.from({ length: data.length - 3 }, (_, i) => i + 1);
    keys = firstRow.map(cell => cell.trim());
    scales = secondRow.map(Number);
    alternatives = thirdRow.map(Number);
    matrix = data.slice(3);
  } else {
    usersID = data.slice(3).map(row => parseInt(row[0]));
    keys = firstRow.slice(1).map(cell => cell.trim());
    scales = secondRow.slice(1).map(Number);
    alternatives = thirdRow.slice(1).map(Number);
    matrix = data.slice(3).map(row => row.slice(1));
  }

  matrix = cleanMatrix(matrix);
  usersID = cleanArray(usersID, user => !isNaN(user));
  keys = cleanArray(keys, key => !!key);
  scales = cleanArray(scales, scale => !isNaN(scale));
  alternatives = cleanArray(alternatives, alt => !isNaN(alt));

  if (matrix.length !== usersID.length) {
    throw new FirstColumnNotContainsNumbersError();
  }

  return { usersID, keys, scales, alternatives, matrix };
}

function generateQuestsData({ keys, scales, alternatives, matrix }: Quest): QuestType[] {
  const uniqueScales = Array.from(new Set(scales));
  return uniqueScales.map(scale => {
    const matchingIndexes = scales.reduce<number[]>((indexes, currentScale, i) => {
      if (currentScale === scale) indexes.push(i);
      return indexes;
    }, []);

    const filteredMatrix = matrix.map(row => matchingIndexes.map(i => row[i].trim()));
    const filteredKeys = matchingIndexes.map(i => keys[i]);
    const filteredAlternatives = matchingIndexes.map(i => alternatives[i]);

    const type = filteredKeys[0].startsWith('+') || filteredKeys[0].startsWith('-')
      ? 'gradu'
      : filteredAlternatives[0] > 2
        ? 'multi'
        : 'binary';

    return {
      uuid: uuidv4(),
      keys: filteredKeys,
      scale,
      alternatives: filteredAlternatives,
      matrix: filteredMatrix,
      type,
      rows: filteredMatrix.length,
      columns: filteredMatrix[0].length,
    };
  });
}

async function loadQuest(data: string[][]): Promise<QuestType[]> {
  validateFirstThreeColumns(data);
  validateNumericRow(data[1].slice(1), new SecondRowNotContainsNumbersError());
  validateNumericRow(data[2].slice(1), new ThirdRowNotContainsNumbersError());

  const { keys, scales, alternatives, matrix } = prepareData(data);

  validateMatrixDimensions(matrix, keys, scales, alternatives);
  validateAlphabeticKeys(keys);

  return generateQuestsData({ keys, scales, alternatives, matrix });
}

export default loadQuest;
