import type { BaseQuest } from './entities/Quest'

type Quest = {
  scale: number
  type: string
  users: number
  items: number
}

export type Metadata = {
  name: string
  uuid: string
  path: string
  quests: Quest[]
}

export abstract class Repository {
  abstract get(uuid: string): Promise<BaseQuest>
  abstract save(quest: BaseQuest): Promise<void>
  abstract delete(uuid: string): Promise<void>
  abstract loadMetadataFile(): Promise<Metadata[]>
  abstract loadQuestFile(path: string): Promise<string[][]>
}
