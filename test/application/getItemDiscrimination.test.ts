import { binaryQuestsNames, multiQuestsNames, QuestMother } from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getItemDiscrimination } from '../../src/application/getItemDiscrimination'

expect.extend({ toEqualWithRounding })

describe('Test Items Discrimination', () => {
  it.each([...binaryQuestsNames, ...multiQuestsNames])(
    'should get correct discrimination for items quest: %s',
    async (name: string) => {
      const { quests, repo } = await getQuest(name)
      const results = await QuestMother.getQuestResult(name)
      expect(quests.length).toBe(results.length)

      await Promise.all(
        quests.map(async (quest, questIndex) => {
          await Promise.all(
            results[questIndex].itemsMap.map(async (_, itemIndex) => {
              const actualDiscrimination = await getItemDiscrimination({ uuid: quest.getUuid(), id: itemIndex }, repo)
              const expectedDiscrimination = results[questIndex].itemsDiscriminations[itemIndex]
              expect(actualDiscrimination.data).toEqualWithRounding(expectedDiscrimination)
            }),
          )
        }),
      )
    },
  )
})
