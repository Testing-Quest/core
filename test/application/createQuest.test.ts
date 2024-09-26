import { RepositoryMock } from '../__mocks__/RepositoryMock'
import { createQuestHandler } from '../../src/application/createQuest'
import type { QuestData } from '../domain/QuestMother'
import { allQuestsNames, QuestMother } from '../domain/QuestMother'
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
} from '../../src/domain/errors/loadErrors'

let repositoryMock: RepositoryMock
let questData: QuestData

beforeEach(() => {
  repositoryMock = new RepositoryMock()
})

describe('createQuestHandler', () => {
  it.each(allQuestsNames)('should create a quest: %s', async (name: string) => {
    // Given
    const questMother = new QuestMother(repositoryMock)
    questData = await questMother.getQuestData(name)

    // When
    const response = await createQuestHandler({ data: questData.matrix }, repositoryMock)

    // Then
    expect(response.error).toBeNull()
    expect(response.childs).toBeDefined()
    repositoryMock.assertSaveHaveBeenCalled()
    for (const child of response.childs!) {
      const quest = questData.quests.find(quest => quest.scale === child.scale)
      expect(child.type).toBe(quest?.type)
      expect(child.useres).toBe(quest?.users)
      expect(child.items).toBe(quest?.items)
      expect(child.uuid).toBeDefined()
    }
  })

  it('Should throw a First Columns Three Rows Not Empty Error', async () => {
    // Given
    const data = [
      ['1', '2', '3'],
      [null, '5', '6'],
      ['7', '8', '9'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(FirstColumnsThreeRowsNotEmptyError.message)
  })

  it('Should throw a Matrix Not Found Error', async () => {
    // Given
    const data = [
      [null, 'A', 'A', 'A'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(MatrixNotFoundError.message)
  })

  it('Should throw a First Row Not Contains Alphabetic Characters Error', async () => {
    // Given
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(FirstRowNotContainsAlphabeticCharactersError.message)
  })

  it('Should throw a Second Row Not Contains Numbers Error', async () => {
    // Given
    const data = [
      [null, 'A', 'A', 'A'],
      [null, 'A', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(SecondRowNotContainsNumbersError.message)
  })

  it('Should throw a Third Row Not Contains Numbers Error', async () => {
    // Given
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1', '1'],
      [null, 'A', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(ThirdRowNotContainsNumbersError.message)
  })

  it('Should throw a First Column Not Contains Numbers Error', async () => {
    // Given
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
      ['B', 'A', 'B', 'C'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(FirstColumnNotContainsNumbersError.message)
  })

  it('Should throw a Column Count Mismatch Keys Error', async () => {
    // Given
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C', 'D'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(ColumnCountMismatchKeysError.message)
  })

  it('Should throw a Column Count Mismatch Scales Error', async () => {
    // Given
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(ColumnCountMismatchScalesError.message)
  })

  it('Should throw a Column Count Mismatch Alternatives Error', async () => {
    // Given
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1', '1'],
      [null, '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    // When
    const response = await createQuestHandler({ data }, repositoryMock)

    // Then
    expect(response.error).toBe(ColumnCountMismatchAlternativesError.message)
  })
})
