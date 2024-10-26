import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getUsersTable } from '../../src/application/getUsersTable'

expect.extend({ toEqualWithRounding })

describe('Test Users Table', () => {
  it.each(allQuestsNames)('should get correct users table for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualTable = await getUsersTable({ uuid: quest.getUuid() }, repo)
        const expectedTable = results[index].usersTable
        expect(actualTable.data).toEqualWithRounding(expectedTable)
      }),
    )
  })
})
