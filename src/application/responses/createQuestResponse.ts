import type { Response } from './response'

export type QuestChild = {
  uuid: string
  scale: number
  type: 'multi' | 'gradu' | 'binary'
  useres: number
  items: number
}

export type CreateQuestResponse = Response & {
  childs: QuestChild[] | null
}
