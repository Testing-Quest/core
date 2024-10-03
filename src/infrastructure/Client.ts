import { createQuest } from '../application/createQuest'
import type { CreateQuestRequest } from '../application/requests/createQuestRequest'
import type { CreateQuestResponse } from '../application/responses/createQuestResponse'
import type { Metadata } from '../domain/repository'
import memoryRepository from './MemoryRepository'
import type { AnalysisQuest } from './react/tabs/analysis/AnalysisQuest'

export class Client {
  private readonly quest: AnalysisQuest

  public constructor(quest: AnalysisQuest) {
    this.quest = quest
    console.log('Client created with quest:', this.quest)
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
