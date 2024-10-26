import { createQuest } from '../../src/application/createQuest'
import { getDirectBlanck } from '../../src/application/getDirectBlank'
import { getDirectCoherency } from '../../src/application/getDirectCoherency'
import { getDirectMci } from '../../src/application/getDirectMci'
import { getDirectWeight } from '../../src/application/getDirectWeight'
import { getHealth } from '../../src/application/getHealth'
import { getItemDiscrimination } from '../../src/application/getItemDiscrimination'
import { getItemFrequency } from '../../src/application/getItemFrequency'
import { getItemMap } from '../../src/application/getItemMap'
import { getItemProfile } from '../../src/application/getItemProfile'
import { getItemTable } from '../../src/application/getItemTable'
import { getModifications } from '../../src/application/getModifications'
import { getReliability } from '../../src/application/getReliability'
import { getScoreDistribution } from '../../src/application/getScoreDistribution'
import { getUsersTable } from '../../src/application/getUsersTable'
import type { Metadata } from '../../src/domain/repository'
import { Client } from '../../src/infrastructure/Client'
import type { AnalysisQuest } from '../../src/infrastructure/react/tabs/analysis/types'
import memoryRepository from '../../src/infrastructure/MemoryRepository'
import { RepositoryMock } from '../__mocks__/RepositoryMock'
import { updateQuest } from '../../src/application/updateQuest'

jest.mock('../../src/application/createQuest')
jest.mock('../../src/application/getHealth')
jest.mock('../../src/application/getDirectBlank')
jest.mock('../../src/application/getDirectCoherency')
jest.mock('../../src/application/getDirectMci')
jest.mock('../../src/application/getDirectWeight')
jest.mock('../../src/application/getItemDiscrimination')
jest.mock('../../src/application/getItemFrequency')
jest.mock('../../src/application/getItemMap')
jest.mock('../../src/application/getItemProfile')
jest.mock('../../src/application/getItemTable')
jest.mock('../../src/application/getModifications')
jest.mock('../../src/application/getReliability')
jest.mock('../../src/application/getScoreDistribution')
jest.mock('../../src/application/getUsersTable')
jest.mock('../../src/application/updateQuest')
jest.mock('../../src/infrastructure/MemoryRepository')

describe('Client', () => {
  beforeEach(() => {
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
      ;(memoryRepository.loadQuestFile as jest.Mock).mockResolvedValue([[]])

      const result = await Client.createQuestfromMetadata(metadata)

      expect(result).toEqual(mockResponse)
      expect(memoryRepository.loadQuestFile).toHaveBeenCalledWith('test.json')
      expect(createQuest).toHaveBeenCalledWith({ data: [[]] }, memoryRepository)
    })
  })

  describe('createQuest', () => {
    it('should create a quest', async () => {
      const payload = { data: [[]] }
      const mockResponse = { childs: [{ uuid: '123', scale: 5, type: 'multi' }] }
      ;(createQuest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await Client.createQuest(payload)

      expect(result).toEqual(mockResponse)
      expect(createQuest).toHaveBeenCalledWith(payload, memoryRepository)
    })
  })

  describe('getMetadata', () => {
    it('should get metadata', async () => {
      const metadataMock = [{ name: 'Test Metadata', path: 'test.json' }]
      ;(memoryRepository.loadMetadataFile as jest.Mock).mockResolvedValue(metadataMock)

      const result = await Client.getMetadata()

      expect(result).toBe(metadataMock)
      expect(memoryRepository.loadMetadataFile).toHaveBeenCalled()
    })
  })

  describe('instance methods', () => {
    let client: Client
    let repositoryMock: RepositoryMock
    const quest: AnalysisQuest = { uuid: '123', name: 'Test Quest', type: 'multi', scale: 5 }

    beforeEach(() => {
      repositoryMock = new RepositoryMock()
      client = new Client(quest, repositoryMock)
    })

    describe('getter methods', () => {
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

    describe('getNumberOfAlternatives', () => {
      it('should return number of alternatives', async () => {
        const mockQuest = {
          getNumAlternatives: jest.fn().mockReturnValue(4),
        }
        repositoryMock.get = jest.fn().mockResolvedValue(mockQuest)

        const result = await client.getNumberOfAlternatives()

        expect(result).toBe(4)
        expect(repositoryMock.get).toHaveBeenCalledWith('123')
      })
    })

    describe('getFrequencyData', () => {
      it('should return frequency data', async () => {
        const mockFrequencyData = { A: 10, B: 20 }
        const mockQuest = {
          getAlternativeFrequency: jest.fn().mockReturnValue(mockFrequencyData),
        }
        repositoryMock.get = jest.fn().mockResolvedValue(mockQuest)

        const result = await client.getFrequencyData()

        expect(result).toEqual(mockFrequencyData)
        expect(repositoryMock.get).toHaveBeenCalledWith('123')
      })
    })

    describe('data retrieval methods', () => {
      const mockResponse = { data: 'test' }

      it('should get health data', async () => {
        ;(getHealth as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getHealthData()
        expect(result).toEqual(mockResponse)
        expect(getHealth).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get reliability data', async () => {
        ;(getReliability as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getReliabilityData()
        expect(result).toEqual(mockResponse)
        expect(getReliability).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get direct blank data', async () => {
        ;(getDirectBlanck as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getDirectBlankData()
        expect(result).toEqual(mockResponse)
        expect(getDirectBlanck).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get direct coherency data', async () => {
        ;(getDirectCoherency as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getDirectCoherencyData()
        expect(result).toEqual(mockResponse)
        expect(getDirectCoherency).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get direct MCI data', async () => {
        ;(getDirectMci as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getDirectMciData()
        expect(result).toEqual(mockResponse)
        expect(getDirectMci).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get direct weight data', async () => {
        ;(getDirectWeight as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getdirectWeightData()
        expect(result).toEqual(mockResponse)
        expect(getDirectWeight).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get item discrimination data', async () => {
        ;(getItemDiscrimination as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getItemDiscriminationData(1)
        expect(result).toEqual(mockResponse)
        expect(getItemDiscrimination).toHaveBeenCalledWith({ uuid: '123', id: 1 }, repositoryMock)
      })

      it('should get item frequency data', async () => {
        ;(getItemFrequency as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getItemFrequencyData(1)
        expect(result).toEqual(mockResponse)
        expect(getItemFrequency).toHaveBeenCalledWith({ uuid: '123', id: 1 }, repositoryMock)
      })

      it('should get item map data', async () => {
        ;(getItemMap as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getItemMapData()
        expect(result).toEqual(mockResponse)
        expect(getItemMap).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get item profile data', async () => {
        ;(getItemProfile as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getItemProfileData(1)
        expect(result).toEqual(mockResponse)
        expect(getItemProfile).toHaveBeenCalledWith({ uuid: '123', id: 1 }, repositoryMock)
      })

      it('should get items table', async () => {
        ;(getItemTable as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getItemsTable()
        expect(result).toEqual(mockResponse)
        expect(getItemTable).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get modifications', async () => {
        ;(getModifications as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getModifications()
        expect(result).toEqual(mockResponse)
        expect(getModifications).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get score distribution', async () => {
        ;(getScoreDistribution as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getScoreDistribution()
        expect(result).toEqual(mockResponse)
        expect(getScoreDistribution).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })

      it('should get users table', async () => {
        ;(getUsersTable as jest.Mock).mockResolvedValue(mockResponse)
        const result = await client.getUsersTable()
        expect(result).toEqual(mockResponse)
        expect(getUsersTable).toHaveBeenCalledWith({ uuid: '123' }, repositoryMock)
      })
    })

    describe('updateQuest', () => {
      it('should update quest', async () => {
        const payload = {
          activeUsers: null,
          activeItems: null,
          keys: null,
        }
        const mockResponse = { success: true }
        ;(updateQuest as jest.Mock).mockResolvedValue(mockResponse)

        const result = await client.updateQuest(payload)

        expect(result).toEqual(mockResponse)
        expect(updateQuest).toHaveBeenCalledWith({ uuid: '123', data: payload }, repositoryMock)
      })
    })
  })
})
