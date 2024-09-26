import type { QuestChild } from '../../../../application/responses/createQuestResponse'

export type UploadQuest = {
  name: string
  uuid: string
  quests: QuestChild[]
}
