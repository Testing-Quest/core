import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'

expect.extend({ toEqualWithRounding })

describe('getHealthHandler', () => {
  it.each(allQuestsNames)('should get correct health for quest: %s', async (name: string) => {
    // Arrange
    const quests = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)

    // Assert
    expect(quests.length).toBe(results.length)

    quests.forEach((quest, index) => {
      const actualHealth = quest.getHealth()
      const expectedHealth = results[index].health

      expect(actualHealth).toEqualWithRounding(expectedHealth)
    })
  })
})
