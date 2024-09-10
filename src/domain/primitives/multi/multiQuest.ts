import { QuestType } from "../quest";
import { multiItemsType } from "./multiItems";
import { multiUsersType } from "./multiUsers";

export type MultiQuestType = QuestType & {
  matrix: string[][];
  keyConflict: number;
  choice: number;
  coherency: number;
  difficulty: number;
  items: multiItemsType;
  users: multiUsersType;
};

