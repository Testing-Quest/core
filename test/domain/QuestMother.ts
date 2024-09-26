import type { Metadata, Repository } from '../../src/domain/repository'

export type QuestData = Metadata & {
  matrix: string[][]
}

export const binaryQuestsNames = []
export const multiQuestsNames = ['Quanty', 'Ji Cod Bo']
export const graduQuestsNames = ['Boss', 'MC24']
export const multipleTypeQuestsNames = ['Hlec Alec']
export const allQuestsNames = [
  ...binaryQuestsNames,
  ...multiQuestsNames,
  ...graduQuestsNames,
  ...multipleTypeQuestsNames,
]

export class QuestMother {
  private readonly repository: Repository

  public constructor(repo: Repository) {
    this.repository = repo
  }

  public async getQuestData(name: string | null): Promise<QuestData> {
    const metadata = await this.repository.loadMetadataFile()
    const data = name
      ? metadata.find(item => item.name === name)
      : metadata[Math.floor(Math.random() * metadata.length)]

    if (!data) {
      throw new Error(`Quest with name '${name}' not found`)
    }
    const quest = await this.repository.loadQuestFile(data.path)

    return { ...data, matrix: quest }
  }
}
