import type { BaseQuest } from './entities/Quest'

export type Repository = {
  get(id: string): Promise<BaseQuest>
  save(quest: BaseQuest): Promise<void>
  delete(id: string): Promise<void>
}
