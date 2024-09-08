import { GraduRepo } from "../../domain/gradu/interfaces/Repository";
import { MultiRepo } from "../../domain/multi/interfaces/Repository";
import { BinaryRepo } from "../../domain/binary/interfaces/Repository";
import loadQuest from "../../domain/shared/services/questLoader";
import { BinaryQuest } from "../../domain/binary/entities/BinaryQuest";

export type createQuest = {
  data: string[][];
};

export type questChild = {
  uuid: string;
  scale: number;
  type: 'multi' | 'gradu' | 'binary';
  useres: number;
  items: number;
};

export type createQuestResponse = {
  childs: questChild[];
};

export async function createQuestHandler(payload: createQuest, multiRepo: MultiRepo, graduRepo: GraduRepo, binaryRepo: BinaryRepo): Promise<createQuestResponse> {
  const quests = await loadQuest(payload.data);
  const childs: questChild[] = [];
  for (const quest of quests) {
    if (quest.type === 'multi') {
      await multiRepo.save(MultiQuest.create(quest));
    } else if (quest.type === 'gradu') {
      await graduRepo.save(GraduQuest.create(quest));
    } else if (quest.type === 'binary') {
      await binaryRepo.save(BinaryQuest.create(quest));
    }
    childs.push({ uuid: quest.uuid, scale: quest.scale, type: quest.type, useres: quest.rows, items: quest.columns });
  }
  return { childs };
}
