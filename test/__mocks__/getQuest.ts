import { readFile } from 'fs/promises'
import { join } from 'path'
import { createQuest } from '../../src/application/createQuest'
import type { BaseQuest } from '../../src/domain/entities/Quest'
import type { Metadata } from '../../src/domain/repository'
import { Repository } from '../../src/domain/repository'
import { QuestMother } from '../domain/QuestMother'
import MetadataJson from '../../public/examples/metadata.json'

class mockedRepository extends Repository {
  private quests: BaseQuest[] = []
  public async get(id: string): Promise<BaseQuest> {
    const quest = this.quests.find(quest => quest.getUuid() === id)
    if (!quest) {
      throw new Error('Quest not found')
    }
    return quest
  }

  public async save(quest: BaseQuest): Promise<void> {
    this.quests.push(quest)
  }

  public async delete(id: string): Promise<void> {
    this.quests = this.quests.filter(quest => quest.getUuid() !== id)
  }

  public async loadMetadataFile(): Promise<Metadata[]> {
    return MetadataJson as Metadata[]
  }

  public async loadQuestFile(path: string): Promise<string[][]> {
    return JSON.parse(await readFile(join(__dirname, '../../public/examples/', path), 'utf-8'))
  }
}

export async function getQuest(name: string): Promise<{ quests: BaseQuest[]; repo: Repository }> {
  const repositoryMock = new mockedRepository()
  const questMother = new QuestMother(repositoryMock)
  const questData = await questMother.getQuestData(name)

  const response = await createQuest({ data: questData.matrix }, repositoryMock)

  // Usamos Promise.all para esperar a que todas las promesas se resuelvan
  const quests = await Promise.all(response.childs!.map(async child => repositoryMock.get(child.uuid)))

  return { quests: quests, repo: repositoryMock }
}
