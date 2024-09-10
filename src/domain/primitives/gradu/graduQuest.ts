import { multiItemsType } from "../../multi/primitives/multiItems";
import { multiUsersType } from "../../multi/primitives/multiUsers";
import { QuestType } from "../quest";

export type GraduQuestType = QuestType & {
  matrix: number[][];
  score: number;
  variability: number;
  items: multiItemsType;
  users: multiUsersType;
};

