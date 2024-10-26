import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getItemMap } from '../../src/application/getItemMap'

expect.extend({ toEqualWithRounding })

describe('Test Item Map', () => {
  it.each(allQuestsNames)('should get correct item map for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualItemMap = await getItemMap({ uuid: quest.getUuid() }, repo)
        const expectedItemMap = results[index].itemsMap
        expect(actualItemMap.data).toEqualWithRounding(expectedItemMap)
      }),
    )
  })
})
