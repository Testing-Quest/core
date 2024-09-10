import { GraduRepo } from "../../domain/gradu/interfaces/Repository";
import { MultiRepo } from "../../domain/multi/interfaces/Repository";
import { BinaryRepo } from "../../domain/binary/interfaces/Repository";
import loadQuest from "../../domain/services/questLoader";
import { BinaryQuest } from "../../domain/binary/entities/BinaryQuest";

type questChild = {
  uuid: string;
  scale: number;
  type: 'multi' | 'gradu' | 'binary';
  useres: number;
  items: number;
};

export type createQuest = {
  data: string[][];
};

export type createQuestResponse = {
  childs: questChild[];
};

export async function createQuestHandler(payload: createQuest, multiRepo: MultiRepo, graduRepo: GraduRepo, binaryRepo: BinaryRepo): Promise<createQuestResponse> {
  const quests = await loadQuest(payload.data);
  const childs: questChild[] = [];
  for (const quest of quests) {
    switch (quest.type) {
      case 'multi':
        await multiRepo.save(MultiQuest.create(quest));
        break;
      case 'gradu':
        await graduRepo.save(GraduQuest.create(quest));
        break;
      case 'binary':
        await binaryRepo.save(BinaryQuest.create(quest));
        break;
      default:
        throw new Error('Invalid quest type');
    }
    childs.push({ uuid: quest.uuid, scale: quest.scale, type: quest.type, useres: quest.matrix.length, items: quest.matrix[0].length });
  }
  return { childs };
}
