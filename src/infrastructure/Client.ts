import { createQuest } from '../application/createQuest'
import type { CreateQuestRequest } from '../application/requests/createQuestRequest'
import type { CreateQuestResponse } from '../application/responses/createQuestResponse'
import type { Metadata } from '../domain/repository'
import memoryRepository from './MemoryRepository'

export class Client {
  private readonly questUuid: string

  public constructor(uuid: string) {
    this.questUuid = uuid
    console.log(this.questUuid)
  }

  public static async createQuestfromMetadata(payload: Metadata): Promise<CreateQuestResponse> {
    const data = await memoryRepository.loadQuestFile(payload.path)
    return createQuest({ data }, memoryRepository)
  }

  public static async createQuest(payload: CreateQuestRequest): Promise<CreateQuestResponse> {
    return createQuest(payload, memoryRepository)
  }

  public static async getMetadata(): Promise<Metadata[]> {
    return memoryRepository.loadMetadataFile()
  }
}
