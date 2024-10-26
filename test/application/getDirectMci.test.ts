import { binaryQuestsNames, multiQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getDirectMci } from '../../src/application/getDirectMci'

expect.extend({ toEqualWithRounding })

describe('Test Direct MCI', () => {
  it.each([...binaryQuestsNames, ...multiQuestsNames])(
    'should get correct direct MCI for quest: %s',
    async (name: string) => {
      const { quests, repo } = await getQuest(name)
      const results = await QuestMother.getQuestResult(name)
      expect(quests.length).toBe(results.length)

      await Promise.all(
        quests.map(async (quest, index) => {
          const actualMci = await getDirectMci({ uuid: quest.getUuid() }, repo)
          const expectedMci = results[index].directMci
          expect(actualMci.data).toEqualWithRounding(expectedMci)
        }),
      )
    },
  )
})
