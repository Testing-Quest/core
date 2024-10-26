import { binaryQuestsNames, multiQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getDirectWeight } from '../../src/application/getDirectWeight'

expect.extend({ toEqualWithRounding })

describe('Test Direct Weight', () => {
  it.each([...binaryQuestsNames, ...multiQuestsNames])(
    'should get correct direct weight for quest: %s',
    async (name: string) => {
      const { quests, repo } = await getQuest(name)
      const results = await QuestMother.getQuestResult(name)
      expect(quests.length).toBe(results.length)

      await Promise.all(
        quests.map(async (quest, index) => {
          const actualWeight = await getDirectWeight({ uuid: quest.getUuid() }, repo)
          const expectedWeight = results[index].directWeight
          expect(actualWeight.data).toEqualWithRounding(expectedWeight)
        }),
      )
    },
  )
})
