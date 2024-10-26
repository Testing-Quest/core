import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getItemTable } from '../../src/application/getItemTable'

expect.extend({ toEqualWithRounding })

describe('Test Item Table', () => {
  it.each(allQuestsNames)('should get correct item table for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualTable = await getItemTable({ uuid: quest.getUuid() }, repo)
        const expectedTable = results[index].itemsTable
        expect(actualTable.data).toEqualWithRounding(expectedTable)
      }),
    )
  })
})
