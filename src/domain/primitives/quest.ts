import { ItemsType } from "./items";
import { UsersType } from "./users";


type MatrixTypes = string[][] | number[][];
type QuestTypes = 'binary' | 'multi' | 'gradu';


export type NewQuestType = {
  uuid: string;
  keys: string[];
  scale: number;
  alternatives: number;
  matrix: MatrixTypes;
  type: QuestTypes;
};

export interface QuestType {
  uuid: string;
  keys: string[];
  scale: number;
  alternatives: number;
  matrix: MatrixTypes;
  type: QuestTypes;
  itemsIds: number[];
  itemsEnabled: boolean[];
  usersIds: number[];
  usersEnabled: boolean[];
  originalKeys: string[];
  calculations: QuestCalculationsType;
};

export type HealthType = {
  cronbachAlpha: number;
  sem: number;
  mean: number;
  variance: number;
  standardDeviation: number;
  reliability: number;
  discrimination: number;
  testHealth: number;
};

export type QuestCalculationsType = {
  health: HealthType;
  correctedMatrix: number[][];
  items: ItemsType;
  users: UsersType;
};
