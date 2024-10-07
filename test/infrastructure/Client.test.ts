import { createQuest } from '../../src/application/createQuest'
import type { Metadata } from '../../src/domain/repository'
import { Client } from '../../src/infrastructure/Client'
import type { AnalysisQuest } from '../../src/infrastructure/react/tabs/analysis/types'
import memoryRepository from '../../src/infrastructure/MemoryRepository'
import { RepositoryMock } from '../__mocks__/RepositoryMock'
import { getHealth } from '../../src/application/getHealth'

jest.mock('../../src/application/createQuest')
jest.mock('../../src/application/getHealth')
jest.mock('../../src/infrastructure/MemoryRepository')

describe('Client', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create a client with the given quest', () => {
      const quest: AnalysisQuest = { uuid: '123', name: 'Test Quest', type: 'multi', scale: 5 }
      const client = new Client(quest)
      expect(client.getQuestName()).toBe('Test Quest')
      expect(client.getQuestType()).toBe('multi')
      expect(client.getQuestScale()).toBe(5)
    })
  })

  describe('createQuestfromMetadata', () => {
    it('should create a quest from metadata', async () => {
      const metadata: Metadata = {
        name: 'Test Metadata',
        uuid: '123',
        path: 'test.json',
        quests: [{ scale: 5, type: 'multi', users: 100, items: 20 }],
      }
      const mockResponse = { childs: [{ uuid: '123', scale: 5, type: 'multi' }] }

      ;(createQuest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await Client.createQuestfromMetadata(metadata)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('createQuest', () => {
    it('should create a quest', async () => {
      const payload = { data: [[]] }
      const mockResponse = { childs: [{ uuid: '123', scale: 5, type: 'multi' }] }

      ;(createQuest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await Client.createQuest(payload)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getMetadata', () => {
    it('should get metadata', async () => {
      const metadataMock = [{ name: 'Test Metadata', path: 'test.json' }]
      ;(memoryRepository.loadMetadataFile as jest.Mock).mockResolvedValue(metadataMock)
      const result = await Client.getMetadata()
      expect(result).toBe(metadataMock)
    })
  })

  describe('getter methods', () => {
    let client: Client

    beforeEach(() => {
      const quest: AnalysisQuest = { uuid: '123', name: 'Test Quest', type: 'multi', scale: 5 }
      client = new Client(quest)
    })

    it('should return quest type', () => {
      expect(client.getQuestType()).toBe('multi')
    })

    it('should return quest scale', () => {
      expect(client.getQuestScale()).toBe(5)
    })

    it('should return quest name', () => {
      expect(client.getQuestName()).toBe('Test Quest')
    })
  })
  describe('get Quest information', () => {
    let client: Client
    let repositoryMock: RepositoryMock

    beforeEach(async () => {
      repositoryMock = new RepositoryMock()
      const quest: AnalysisQuest = { uuid: '123', name: 'Test Quest', type: 'multi', scale: 5 }
      client = new Client(quest, repositoryMock)
    })

    it('should return health', async () => {
      const mockResponse = { test: 1 }

      ;(getHealth as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.getHealthData()

      expect(result).toEqual(mockResponse)
      expect(getHealth).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
    })
  })
})
