import { QuestCalculationsType, QuestType } from "../quest";
import { binaryItemsType } from "./binaryItems";
import { binaryUsersType } from "./binaryUsers";

export type BinaryQuestType = QuestType & {
  matrix: string[][];
  calculations: BinaryQuestCalculationsType;
};

export type BinaryQuestCalculationsType = QuestCalculationsType & {
  coherency: number;
  difficulty: number;
  items: binaryItemsType;
  users: binaryUsersType;
};

