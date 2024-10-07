import type { Metadata, Repository } from '../../src/domain/repository'
import type { Result } from './types'
import bossResults from './results/BossResults.json'
import calResults from './results/CALResults.json'
import mc24Results from './results/MC24Results.json'
import hlecAlecResults from './results/Hlec AlecResults.json'
import moodResults from './results/MoodResults.json'
import quantyResults from './results/QuantyResults.json'
import britishResults from './results/BritishResults.json'

const results: Record<string, Result[]> = {
  Boss: bossResults as unknown as Result[],
  CAL: calResults as unknown as Result[],
  MC24: mc24Results as unknown as Result[],
  'Hlec Alec': hlecAlecResults as unknown as Result[],
  Mood: moodResults as unknown as Result[],
  Quanty: quantyResults as unknown as Result[],
  British: britishResults as unknown as Result[],
}

export type QuestData = Metadata & {
  matrix: string[][]
}

export const binaryQuestsNames = ['CAL']
export const multiQuestsNames = ['Quanty', 'British']
export const graduQuestsNames = ['Boss', 'MC24', 'Mood']
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

  public static async getQuestResult(name: string): Promise<Result[]> {
    return results[name]
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
