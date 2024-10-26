import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getReliability } from '../../src/application/getReliability'

expect.extend({ toEqualWithRounding })

describe('Test Reliability', () => {
  it.each(allQuestsNames)('should get correct reliability for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualReliability = await getReliability({ uuid: quest.getUuid() }, repo)
        const expectedReliability = results[index].reliability
        expect(actualReliability.reliability).toEqualWithRounding(expectedReliability)
      }),
    )
  })
})
