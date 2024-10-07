import { createQuest } from '../application/createQuest'
import { getDirectBlanck } from '../application/getDirectBlank'
import { getDirectCoherency } from '../application/getDirectCoherency'
import { getDirectMci } from '../application/getDirectMci'
import { getDirectWeight } from '../application/getDirectWeight'
import { getHealth } from '../application/getHealth'
import { getItemDiscrimination } from '../application/getItemDiscrimination'
import { getItemFrequency } from '../application/getItemFrequency'
import { getItemMap } from '../application/getItemMap'
import { getItemProfile } from '../application/getItemProfile'
import { getItemTable } from '../application/getItemTable'
import { getModifications } from '../application/getModifications'
import { getReliability } from '../application/getReliability'
import { getScoreDistribution } from '../application/getScoreDistribution'
import { getUsersTable } from '../application/getUsersTable'
import type { CreateQuestRequest } from '../application/requests/createQuestRequest'
import type { UpdateRequest } from '../application/requests/updateRequest'
import type { CreateQuestResponse } from '../application/responses/createQuestResponse'
import type { GetDirectBlankResponse } from '../application/responses/getDirectBlankResponse'
import type { GetDirectCoherencyResponse } from '../application/responses/getDirectCoherencyResponse'
import type { GetDirectMciResponse } from '../application/responses/getDirectMciResponse'
import type { GetDirectWeightResponse } from '../application/responses/getDirectWeightResponse'
import type { GetHealthResponse } from '../application/responses/getHealthResponse'
import type { GetItemDiscriminationResponse } from '../application/responses/getItemDiscriminationResponse'
import type { GetItemFrequencyResponse } from '../application/responses/getItemFrequencyResponse'
import type { GetItemMapResponse } from '../application/responses/getItemMapResponse'
import type { GetItemProfileResponse } from '../application/responses/getItemProfileResponse'
import type { GetItemTableResponse } from '../application/responses/getItemTableResponse'
import type { GetModificatinosResponse } from '../application/responses/getModificationsResponse'
import type { GetReliabilityResponse } from '../application/responses/getReliabilityResponse'
import type { GetScoreDistributionResponse } from '../application/responses/getScoreDistributionResponse'
import type { GetUsersTableResponse } from '../application/responses/getUsersTableResponse'
import type { UpdateResponse } from '../application/responses/updateResponse'
import { updateQuest } from '../application/updateQuest'
import type { Metadata, Repository } from '../domain/repository'
import memoryRepository from './MemoryRepository'
import type { AnalysisQuest } from './react/tabs/analysis/types'

export class Client {
  private readonly quest: AnalysisQuest
  private readonly repo: Repository

  public constructor(quest: AnalysisQuest, repo?: Repository) {
    this.quest = quest
    this.repo = repo || memoryRepository
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

  public getQuestType(): AnalysisQuest['type'] {
    return this.quest.type
  }

  public getQuestScale(): AnalysisQuest['scale'] {
    return this.quest.scale
  }

  public getQuestName(): AnalysisQuest['name'] {
    return this.quest.name
  }

  public async getNumberOfAlternatives(): Promise<number> {
    // TODO: MOVE TO APPLICATION
    const quest = await this.repo.get(this.quest.uuid)
    return quest.getNumAlternatives()
  }

  public async getFrequencyData(): Promise<Record<string, number>> {
    // TODO: MOVE TO APPLICATION
    const quest = await this.repo.get(this.quest.uuid)
    return quest.getAlternativeFrequency()
  }

  public async getHealthData(): Promise<GetHealthResponse> {
    const data = await getHealth({ uuid: this.quest.uuid }, this.repo)
    return data
  }

  public async getReliabilityData(): Promise<GetReliabilityResponse> {
    return getReliability({ uuid: this.quest.uuid }, this.repo)
  }

  public async getDirectBlankData(): Promise<GetDirectBlankResponse> {
    return getDirectBlanck({ uuid: this.quest.uuid }, this.repo)
  }

  public async getDirectCoherencyData(): Promise<GetDirectCoherencyResponse> {
    return getDirectCoherency({ uuid: this.quest.uuid }, this.repo)
  }

  public async getDirectMciData(): Promise<GetDirectMciResponse> {
    return getDirectMci({ uuid: this.quest.uuid }, this.repo)
  }

  public async getdirectWeightData(): Promise<GetDirectWeightResponse> {
    return getDirectWeight({ uuid: this.quest.uuid }, this.repo)
  }

  public async getItemDiscriminationData(id: number): Promise<GetItemDiscriminationResponse> {
    return getItemDiscrimination({ uuid: this.quest.uuid, id }, this.repo)
  }

  public async getItemFrequencyData(id: number): Promise<GetItemFrequencyResponse> {
    return getItemFrequency({ uuid: this.quest.uuid, id }, this.repo)
  }

  public async getItemMapData(): Promise<GetItemMapResponse> {
    return getItemMap({ uuid: this.quest.uuid }, this.repo)
  }

  public async getItemProfileData(id: number): Promise<GetItemProfileResponse> {
    return getItemProfile({ uuid: this.quest.uuid, id }, this.repo)
  }

  public async getItemsTable(): Promise<GetItemTableResponse> {
    return getItemTable({ uuid: this.quest.uuid }, this.repo)
  }

  public async getModifications(): Promise<GetModificatinosResponse> {
    return getModifications({ uuid: this.quest.uuid }, this.repo)
  }

  public async getScoreDistribution(): Promise<GetScoreDistributionResponse> {
    return getScoreDistribution({ uuid: this.quest.uuid }, this.repo)
  }

  public async getUsersTable(): Promise<GetUsersTableResponse> {
    return getUsersTable({ uuid: this.quest.uuid }, this.repo)
  }

  public async updateQuest(payload: UpdateRequest['data']): Promise<UpdateResponse> {
    return updateQuest({ uuid: this.quest.uuid, data: payload }, this.repo)
  }
}
