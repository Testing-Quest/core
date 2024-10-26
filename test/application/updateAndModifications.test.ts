import { allQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { getModifications } from '../../src/application/getModifications'
import { updateQuest } from '../../src/application/updateQuest'
import { getHealth } from '../../src/application/getHealth'
import { toEqualWithRounding } from '../helpers'

expect.extend({ toEqualWithRounding })

describe('Test Update and Get Modifications', () => {
  it.each(allQuestsNames)('should get initial modifications for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async quest => {
        const actualModifications = await getModifications({ uuid: quest.getUuid() }, repo)

        expect(actualModifications.response).toBeDefined()

        expect(actualModifications.response!.keys).toEqual(actualModifications.response!.originalKeys)

        actualModifications.response!.items.forEach(item => {
          expect(item).toBeTruthy()
        })

        actualModifications.response!.users.forEach(user => {
          expect(user).toBeTruthy()
        })
      }),
    )
  })

  it.each(allQuestsNames)('should get modifications after update for quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async quest => {
        const actualModifications = await getModifications({ uuid: quest.getUuid() }, repo)
        const newActiveUsers = actualModifications.response!.users.map(() => Math.random() < 0.5)
        const newActiveItems = actualModifications.response!.items.map(() => Math.random() < 0.5)
        await updateQuest(
          {
            uuid: quest.getUuid(),
            data: {
              activeItems: newActiveItems,
              activeUsers: newActiveUsers,
              keys: null,
            },
          },
          repo,
        )
        const newModifications = await getModifications({ uuid: quest.getUuid() }, repo)

        expect(newModifications.response).toBeDefined()

        expect(newModifications.response!.keys).toEqual(newModifications.response!.originalKeys)
        expect(newModifications.response!.keys).toEqual(actualModifications.response!.keys)

        newModifications.response!.items.forEach((item, index) => {
          expect(item).toBe(newActiveItems[index])
        })

        newModifications.response!.users.forEach((user, index) => {
          expect(user).toBe(newActiveUsers[index])
        })
      }),
    )
  })

  it.each(allQuestsNames)('should update modify health quest: %s', async (name: string) => {
    const { quests, repo } = await getQuest(name)
    const results = await QuestMother.getQuestResult(name)
    expect(quests.length).toBe(results.length)

    await Promise.all(
      quests.map(async (quest, index) => {
        const actualModifications = await getModifications({ uuid: quest.getUuid() }, repo)
        const newActiveUsers = actualModifications.response!.users.map(() => Math.random() < 0.5)
        const newActiveItems = actualModifications.response!.items.map(() => Math.random() < 0.5)
        await updateQuest(
          {
            uuid: quest.getUuid(),
            data: {
              activeItems: newActiveItems,
              activeUsers: newActiveUsers,
              keys: null,
            },
          },
          repo,
        )

        const actualHealth = await getHealth({ uuid: quest.getUuid() }, repo)
        const expectedHealth = results[index].health
        expect(actualHealth.data).not.toEqualWithRounding(expectedHealth)
      }),
    )
  })
})
