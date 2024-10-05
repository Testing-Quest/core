import * as fs from 'fs';
import * as path from 'path';
import { createQuest } from '../src/application/createQuest';
import { allQuestsNames, QuestMother } from '../test/domain/QuestMother';
import { Metadata, Repository } from '../src/domain/repository';
import { BaseQuest } from '../src/domain/entities/Quest';
import MetadataJson from '../public/examples/metadata.json';
import { readFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    return JSON.parse(await readFile(join(__dirname, '../public/examples/', path), 'utf-8'))
  }
}

async function generateSnapshots() {
  const repositoryMock = new mockedRepository();

  for (const name of allQuestsNames) {
    const questMother = new QuestMother(repositoryMock);
    const questData = await questMother.getQuestData(name);

    const response = await createQuest({ data: questData.matrix }, repositoryMock);
    const results: any[] = [];

    for (const child of response.childs!) {
      const map = new Map<string, any>();
      const quest = await repositoryMock.get(child.uuid);

      const methods = [
        'getHealth', 'getReliability', 'getItemsMap', 'getDirectWeight',
        'getDirectBlank', 'getDirectCohrency', 'getDirectMci', 'getScoreDistribution',
        'getItemsTable', 'getUsersTable'
      ];

      methods.forEach(method => {
        try {
          map.set(method.slice(3).charAt(0).toLowerCase() + method.slice(4), (quest as any)[method]());
        } catch (error) {
          map.set(method.slice(3).charAt(0).toLowerCase() + method.slice(4), null);
        }
      });

      const itemIds = Array.from({ length: child.items }, (_, index) => index);

      itemIds.forEach(itemId => {
        ['getItemFrequency', 'getItemDiscrimination', 'getItemProfile'].forEach(method => {
          try {
            map.set(`${method.slice(3).charAt(0).toLowerCase() + method.slice(4)}_${itemId}`, (quest as any)[method](itemId));
          } catch (error) {
            map.set(`${method.slice(3).charAt(0).toLowerCase() + method.slice(4)}_${itemId}`, null);
          }
        });
      });

      const resultObject = Object.fromEntries(map);
      results.push(resultObject);
    }

    const filePath = path.join(__dirname, `../test/domain/results/${name}Results.json`);
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`File saved at: ${filePath}`);
  }
}

generateSnapshots().catch(console.error);
