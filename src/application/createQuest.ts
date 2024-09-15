import { Quest } from '../domain/entities/Quest'
import { Repository } from '../domain/repository'
import loadQuest from '../domain/services/questLoader'

type questChild = {
  uuid: string
  scale: number
  type: 'multi' | 'gradu' | 'binary'
  useres: number
  items: number
}

export type createQuest = {
  data: string[][]
}

export type createQuestResponse = {
  childs: questChild[]
}

export async function createQuestHandler(
  payload: createQuest,
  repository: Repository,
): Promise<createQuestResponse> {
  const quests = await loadQuest(payload.data)
  const childs: questChild[] = []
  for (const quest of quests) {
    repository.save(Quest.create(quest))
    childs.push({
      uuid: quest.uuid,
      scale: quest.scale,
      type: quest.type,
      useres: quest.matrix.length,
      items: quest.matrix[0].length,
    })
  }
  return { childs }
}
