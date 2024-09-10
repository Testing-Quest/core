import { QuestType } from "../quest";
import { binaryItemsType } from "./binaryItems";
import { binaryUsersType } from "./binaryUsers";

export type BinaryQuestType = QuestType & {
  matrix: string[][];
  coherency: number;
  difficulty: number;
  items: binaryItemsType;
  users: binaryUsersType;
};

