import { RepositoryMock } from '../__mocks__/RepositoryMock'
import { createQuest } from '../../src/application/createQuest'
import type { QuestData } from '../domain/QuestMother'
import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import {
  ColumnCountMismatchKeysError,
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
    const questMother = new QuestMother(repositoryMock)
    questData = await questMother.getQuestData(name)

    const response = await createQuest({ data: questData.matrix }, repositoryMock)

    expect(response.error).toBeNull()
    expect(response.childs).toBeDefined()
    repositoryMock.assertSaveHaveBeenCalled()
    for (const child of response.childs!) {
      const quest = questData.quests.find(quest => quest.scale === child.scale)
      expect(child.type).toBe(quest?.type)
      expect(child.users).toBe(quest?.users)
      expect(child.items).toBe(quest?.items)
      expect(child.uuid).toBeDefined()
    }
  })

  it('Should throw a Matrix Not Found Error', async () => {
    const data = [
      [null, 'A', 'A', 'A'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBe(MatrixNotFoundError.message)
  })

  it('Should throw a First Row Not Contains Alphabetic Characters Error', async () => {
    const data = [
      [null, '123', '456', '789'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBe(FirstRowNotContainsAlphabeticCharactersError.message)
  })

  it('Should throw a Second Row Not Contains Numbers Error', async () => {
    const data = [
      [null, 'A', 'A', 'A'],
      [null, 'A', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBe(SecondRowNotContainsNumbersError.message)
  })

  it('Should throw a Third Row Not Contains Numbers Error', async () => {
    const data = [
      [null, 'A', 'B', 'C'],
      [null, '1', '1', '1'],
      [null, 'A', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBe(ThirdRowNotContainsNumbersError.message)
  })

  it('Should throw a Column Count Mismatch Keys Error', async () => {
    const data = [
      [null, 'A', 'B', 'C', 'D'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBe(ColumnCountMismatchKeysError.message)
  })

  it('Should throw a Column Count Mismatch Scales Error', async () => {
    const data = [
      [null, 'A', 'B', 'C'],
      [null, '1', '1', '1', '1'],
      [null, '4', '4', '4'],
      [1, 'A', 'B', 'C'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBeNull()
  })

  it('Should throw a Column Count Mismatch Alternatives Error', async () => {
    const data = [
      [null, 'A', 'B', 'C'],
      [null, '1', '1', '1'],
      [null, '4', '4', '4', '5'],
      [1, 'A', 'B', 'C'],
    ]

    const response = await createQuest({ data }, repositoryMock)

    expect(response.error).toBeNull()
  })
})
