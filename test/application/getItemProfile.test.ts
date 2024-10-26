import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getItemProfile } from '../../src/application/getItemProfile'

expect.extend({ toEqualWithRounding })

describe('Test Items Profile', () => {
  it.each(allQuestsNames)('should get correct profile for items quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, questIndex) => {
        await Promise.all(
          results[questIndex].itemsMap.map(async (_, itemIndex) => {
            const actualProfile = await getItemProfile({ uuid: quest.getUuid(), id: itemIndex }, repo)
            const expectedProfile = results[questIndex].itemsProfiles[itemIndex]
            expect(actualProfile.data).toEqualWithRounding(expectedProfile)
          }),
        )
      }),
    )
  })
})
