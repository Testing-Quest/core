import type { Metadata, Repository } from '../../src/domain/repository'
import type { BaseQuest } from '../../src/domain/entities/Quest'
import MetadataJson from '../../public/examples/metadata.json'
import { readFile } from 'fs/promises'
import { join } from 'path'

export class RepositoryMock implements Repository {
  private readonly saveMock: jest.Mock
  private readonly deleteMock: jest.Mock
  private readonly getMock: jest.Mock
  private quests: BaseQuest[] = []

  public constructor() {
    this.saveMock = jest.fn()
    this.deleteMock = jest.fn()
    this.getMock = jest.fn()
  }

  public async get(id: string): Promise<BaseQuest> {
    this.getMock(id)
    const quest = this.quests.find(quest => quest.getUuid() === id)
    if (!quest) {
      throw new Error('Quest not found')
    }
    return quest
  }

  public async save(quest: BaseQuest): Promise<void> {
    this.saveMock(quest)
    this.quests.push(quest)
  }

  public async delete(id: string): Promise<void> {
    this.deleteMock(id)
    this.quests = this.quests.filter(quest => quest.getUuid() !== id)
  }

  public async loadMetadataFile(): Promise<Metadata[]> {
    return MetadataJson as Metadata[]
  }

  public async loadQuestFile(path: string): Promise<string[][]> {
    return JSON.parse(await readFile(join(__dirname, '../../public/examples/', path), 'utf-8'))
  }

  public assertSaveHaveBeenCalled(): void {
    expect(this.saveMock).toHaveBeenCalled()
  }

  public assertDeleteHaveBeenCalled(): void {
    expect(this.deleteMock).toHaveBeenCalled()
  }

  public assertGetHaveBeenCalled(): void {
    expect(this.getMock).toHaveBeenCalled()
  }

  public assertSaveHaveBeenCalledWith(expected: BaseQuest): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected)
  }

  public assertDeleteHaveBeenCalledWith(expected: string): void {
    expect(this.deleteMock).toHaveBeenCalledWith(expected)
  }

  public assertGetHaveBeenCalledWith(expected: string): void {
    expect(this.getMock).toHaveBeenCalledWith(expected)
  }
}
