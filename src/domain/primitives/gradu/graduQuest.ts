import { QuestType } from "../quest";
import { graduItemsType } from "./graduItems";
import { graduUsersType } from "./graduUsers";

export type GraduQuestType = QuestType & {
  matrix: number[][];
  score: number;
  variability: number;
  items: graduItemsType;
  users: graduUsersType;
};

