import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getScoreDistribution } from '../../src/application/getScoreDistribution'

expect.extend({ toEqualWithRounding })

describe('Test Score Distribution', () => {
  it.each(allQuestsNames)('should get correct score distribution for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualDistribution = await getScoreDistribution({ uuid: quest.getUuid() }, repo)
        const expectedDistribution = results[index].scoreDistribution
        expect(actualDistribution.data).toEqualWithRounding(expectedDistribution)
      }),
    )
  })
})
