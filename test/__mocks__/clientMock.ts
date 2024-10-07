import type { CreateQuestRequest } from '../../src/application/requests/createQuestRequest'
import type { CreateQuestResponse } from '../../src/application/responses/createQuestResponse'
import type { GetHealthResponse } from '../../src/application/responses/getHealthResponse'
import type { Metadata } from '../../src/domain/repository'
import type { AnalysisQuest } from '../../src/infrastructure/react/tabs/analysis/types'

export class ClientMock {
  private readonly quest: AnalysisQuest
  private mockHealth: GetHealthResponse | null = null

  constructor(quest: AnalysisQuest) {
    this.quest = quest
  }

  public static createQuestfromMetadata = jest.fn(async (payload: Metadata): Promise<CreateQuestResponse> => {
    return { childs: [], error: null }
  })

  public static createQuest = jest.fn(async (payload: CreateQuestRequest): Promise<CreateQuestResponse> => {
    return { childs: [], error: null }
  })

  public static getMetadata = jest.fn(async (): Promise<Metadata[]> => {
    return []
  })

  public getQuestType(): AnalysisQuest['type'] {
    return this.quest.type
  }

  public getQuestScale(): AnalysisQuest['scale'] {
    return this.quest.scale
  }

  public getQuestName(): AnalysisQuest['name'] {
    return this.quest.name
  }

  public async getHealth(): Promise<GetHealthResponse> {
    if (this.mockHealth) {
      return this.mockHealth
    }
    throw new Error('Mock health data not set')
  }

  // Methods to set mock data for testing
  public setMockHealth(health: GetHealthResponse): void {
    this.mockHealth = health
  }

  // Static method to create a pre-configured mock client
  public static createMockClient(options: {
    type?: AnalysisQuest['type']
    scale?: AnalysisQuest['scale']
    name?: string
    health?: GetHealthResponse
  }): ClientMock {
    const mockQuest: AnalysisQuest = {
      type: options.type || 'multi',
      scale: options.scale || 1,
      name: options.name || 'Mock Quest',
      uuid: 'mock-uuid',
    }

    const client = new ClientMock(mockQuest)
    if (options.health) {
      client.setMockHealth(options.health)
    }
    return client
  }
}
