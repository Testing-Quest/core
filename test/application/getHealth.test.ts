import {
  allQuestsNames,
  binaryQuestsNames,
  graduQuestsNames,
  multiQuestsNames,
  QuestMother,
} from '../domain/QuestMother'
import { getQuest } from '../__mocks__/getQuest'
import { toEqualWithRounding } from '../helpers'
import { getHealth } from '../../src/application/getHealth'

expect.extend({ toEqualWithRounding })

const COMMON_HEALTH_PROPERTIES = [
  'cronbachAlpha',
  'sem',
  'mean',
  'variance',
  'standardDeviation',
  'reliability',
  'discrimination',
  'testHealth',
]

const MULTI_QUEST_PROPERTIES = [...COMMON_HEALTH_PROPERTIES, 'keyConflict', 'choice', 'coherency', 'difficulty']
const GRADU_QUEST_PROPERTIES = [...COMMON_HEALTH_PROPERTIES, 'score', 'variability']
const BINARY_QUEST_PROPERTIES = [...COMMON_HEALTH_PROPERTIES, 'coherency', 'difficulty']

function testHealthProperties(health: { [prop: string]: number }, properties: string[]) {
  properties.forEach(prop => {
    expect(health[prop]).not.toBeNull()
    expect(health[prop]).not.toBeNaN()
  })
}

describe('Quest Health Tests', () => {
  describe('All Quests', () => {
    it.each(allQuestsNames)('should get correct health for quest: %s', async (name: string) => {
      const { quests, repo } = await getQuest(name)
      const results = await QuestMother.getQuestResult(name)
      expect(quests.length).toBe(results.length)

      await Promise.all(
        quests.map(async (quest, index) => {
          const actualHealth = await getHealth({ uuid: quest.getUuid() }, repo)
          const expectedHealth = results[index].health
          expect(actualHealth.data).toEqualWithRounding(expectedHealth)
        }),
      )
    })
  })

  describe('Multi Quests', () => {
    it.each(multiQuestsNames)('should have correct health properties for multi quest: %s', async (name: string) => {
      const { quests, repo } = await getQuest(name)

      await Promise.all(
        quests.map(async quest => {
          const health = await getHealth({ uuid: quest.getUuid() }, repo)
          expect(health.data).toBeDefined()
          testHealthProperties(health.data!, MULTI_QUEST_PROPERTIES)
        }),
      )
    })
  })

  describe('Gradu Quests', () => {
    it.each(graduQuestsNames)('should have correct health properties for gradu quest: %s', async (name: string) => {
      const { quests, repo } = await getQuest(name)

      await Promise.all(
        quests.map(async quest => {
          const health = await getHealth({ uuid: quest.getUuid() }, repo)
          expect(health.data).toBeDefined()
          testHealthProperties(health.data!, GRADU_QUEST_PROPERTIES)
        }),
      )
    })
  })

  describe('Binary Quests', () => {
    it.each(binaryQuestsNames)('should have correct health properties for binary quest: %s', async (name: string) => {
      const { quests, repo } = await getQuest(name)

      await Promise.all(
        quests.map(async quest => {
          const health = await getHealth({ uuid: quest.getUuid() }, repo)
          expect(health.data).toBeDefined()
          testHealthProperties(health.data!, BINARY_QUEST_PROPERTIES)
        }),
      )
    })
  })
})
