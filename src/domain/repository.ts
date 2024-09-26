import type { BaseQuest } from './entities/Quest'

type Quest = {
  scale: number
  type: string
  users: number
  items: number
}

export type Metadata = {
  name: string
  path: string
  quests: Quest[]
}

export type Repository = {
  get(uuid: string): Promise<BaseQuest>
  save(quest: BaseQuest): Promise<void>
  delete(uuid: string): Promise<void>
  loadMetadataFile(): Promise<Metadata[]>
  loadQuestFile(path: string): Promise<string[][]>
}
