import type { BaseQuest } from './entities/Quest'
import MetadataJson from '../../public/examples/metadata.json'
import { readFile } from 'fs/promises'
import { join } from 'path'

type Quest = {
  scale: number
  type: string
  users: number
  items: number
}

export type Metadata = {
  name: string
  path: string
  quests: Quest[]
}

export abstract class Repository {
  abstract get(uuid: string): Promise<BaseQuest>
  abstract save(quest: BaseQuest): Promise<void>
  abstract delete(uuid: string): Promise<void>
  public async loadMetadataFile(): Promise<Metadata[]> {
    return MetadataJson as Metadata[]
  }

  public async loadQuestFile(path: string): Promise<string[][]> {
    return JSON.parse(await readFile(join(__dirname, '../..', path), 'utf-8'))
  }
}
