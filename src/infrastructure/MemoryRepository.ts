import type { BaseQuest } from '../domain/entities/Quest'
import type { Metadata } from '../domain/repository'
import { Repository } from '../domain/repository'

class MemoryRepository extends Repository {
  private readonly data: Record<string, BaseQuest> = {}

  public async get(uuid: string): Promise<BaseQuest> {
    if (!this.data[uuid]) {
      throw new Error('Quest not found')
    }
    return this.data[uuid]
  }
  public async save(quest: BaseQuest): Promise<void> {
    this.data[quest.getUuid()] = quest
  }
  public async delete(uuid: string): Promise<void> {
    delete this.data[uuid]
  }
  public async loadMetadataFile(): Promise<Metadata[]> {
    const response = await fetch('/examples/metadata.json')
    if (!response.ok) {
      throw new Error(`Failed to load metadata file: ${response.statusText}`)
    }
    return response.json()
  }

  public async loadQuestFile(path: string): Promise<string[][]> {
    const response = await fetch(`/examples/${path}`)
    if (!response.ok) {
      throw new Error(`Failed to load quest file: ${response.statusText}`)
    }
    return response.json()
  }
}

const memoryRepository = new MemoryRepository()

export default memoryRepository
