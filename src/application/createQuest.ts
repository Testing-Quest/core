import { Quest } from '../domain/entities/Quest'
import type { Repository } from '../domain/repository'
import loadQuest from '../domain/services/questLoader'
import type { Response } from './response'

type QuestChild = {
  uuid: string
  scale: number
  type: 'multi' | 'gradu' | 'binary'
  useres: number
  items: number
}

export type CreateQuest = {
  data: string[][]
}

export type CreateQuestResponse = Response & {
  childs: QuestChild[] | null
}

async function _createQuest(
  payload: CreateQuest,
  repository: Repository,
): Promise<CreateQuestResponse> {
  const quests = await loadQuest(payload.data)
  const childs: QuestChild[] = []
  for (const quest of quests) {
    await repository.save(Quest.create(quest))
    childs.push({
      uuid: quest.uuid,
      scale: quest.scale,
      type: quest.type,
      useres: quest.matrix.length,
      items: quest.matrix[0].length,
    })
  }
  return { childs, error: null }
}

export async function createQuestHandler(
  payload: CreateQuest,
  repository: Repository,
): Promise<CreateQuestResponse> {
  try {
    return await _createQuest(payload, repository)
  } catch (error: unknown) {
    return {
      childs: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
