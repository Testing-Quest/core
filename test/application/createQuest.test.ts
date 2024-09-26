import { RepositoryMock } from '../__mocks__/RepositoryMock'
import { createQuestHandler } from '../../src/application/createQuest'
import { QuestData, QuestMother } from '../domain/QuestMother'

let repositoryMock: RepositoryMock
let questData: QuestData

beforeEach(() => {
  repositoryMock = new RepositoryMock()
})

describe('createQuestHandler', () => {
  it('should create a quest', async () => {
    // Given
    const questMother = new QuestMother(repositoryMock)
    questData = await questMother.getQuestData(null)

    // When
    const response = await createQuestHandler({ data: questData.matrix }, repositoryMock)

    // Then
    expect(response.error).toBeNull()
    expect(response.childs).toBeDefined()
    for (const child of response.childs!) {
      const quest = questData.quests.find(quest => quest.scale === child.scale)
      expect(child.type).toBe(quest?.type)
      expect(child.useres).toBe(quest?.users)
      expect(child.items).toBe(quest?.items)
      expect(child.uuid).toBeDefined()
    }
  })
})
