import { binaryQuestsNames, multiQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getDirectCoherency } from '../../src/application/getDirectCoherency'

expect.extend({ toEqualWithRounding })

describe('Test Direct Coherency', () => {
  it.each([...binaryQuestsNames, ...multiQuestsNames])(
    'should get correct direct coherency for quest: %s',
    async (name: string) => {
      const { quests, repo } = await getQuest(name)
      const results = await QuestMother.getQuestResult(name)
      expect(quests.length).toBe(results.length)

      await Promise.all(
        quests.map(async (quest, index) => {
          const actualCoherency = await getDirectCoherency({ uuid: quest.getUuid() }, repo)
          const expectedCoherency = results[index].directCohrency
          expect(actualCoherency.data).toEqualWithRounding(expectedCoherency)
        }),
      )
    },
  )
})
