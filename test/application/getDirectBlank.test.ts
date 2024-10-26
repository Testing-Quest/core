import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getDirectBlanck } from '../../src/application/getDirectBlank'

expect.extend({ toEqualWithRounding })

describe('Test Direct Blank', () => {
  it.each(allQuestsNames)('should get correct direct blank for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualHealth = await getDirectBlanck({ uuid: quest.getUuid() }, repo)
        const expectedHealth = results[index].directBlank
        expect(actualHealth.data).toEqualWithRounding(expectedHealth)
      }),
    )
  })
})
