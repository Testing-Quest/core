import type { BaseQuest } from '../../src/domain/entities/Quest'
import memoryRepository from '../../src/infrastructure/MemoryRepository'

describe('MemoryRepository', () => {
  const repository = memoryRepository

  describe('get', () => {
    it('should return a quest if it exists', async () => {
      const mockQuest = { getUuid: () => 'test-uuid' } as BaseQuest
      await repository.save(mockQuest)

      const result = await repository.get('test-uuid')
      expect(result).toBe(mockQuest)
    })

    it('should throw an error if quest does not exist', async () => {
      await expect(repository.get('non-existent-uuid')).rejects.toThrow('Quest not found')
    })
  })

  describe('save', () => {
    it('should save a quest', async () => {
      const mockQuest = { getUuid: () => 'test-uuid' } as BaseQuest
      await repository.save(mockQuest)

      const result = await repository.get('test-uuid')
      expect(result).toBe(mockQuest)
    })
  })

  describe('delete', () => {
    it('should delete a quest', async () => {
      const mockQuest = { getUuid: () => 'test-uuid' } as BaseQuest
      await repository.save(mockQuest)
      await repository.delete('test-uuid')

      await expect(repository.get('test-uuid')).rejects.toThrow('Quest not found')
    })
  })
})
