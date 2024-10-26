import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getItemFrequency } from '../../src/application/getItemFrequency'

expect.extend({ toEqualWithRounding })

describe('Test Items Frequency', () => {
  it.each(allQuestsNames)('should get correct frequency for items quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, questIndex) => {
        await Promise.all(
          results[questIndex].itemsMap.map(async (_, itemIndex) => {
            const actualFrequency = await getItemFrequency({ uuid: quest.getUuid(), id: itemIndex }, repo)
            const expectedFrequency = results[questIndex].itemsFrequencies[itemIndex]
            expect(actualFrequency.data).toEqualWithRounding(expectedFrequency)
          }),
        )
      }),
    )
  })
})
