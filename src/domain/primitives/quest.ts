export type NewQuestType = {
  uuid: string;
  keys: string[];
  scale: number;
  alternatives: number;
  matrix: string[][];
  type: 'gradu' | 'multi' | 'binary';
};

export type QuestType = NewQuestType &{
  itemsIds: number[];
  itemsEnabled: boolean[];
  usersIds: number[];
  usersEnabled: boolean[];
  originalKeys: string[];
  calculations: QuestCalculationsType;
};

export type QuestCalculationsType = {
  directScore: number[];
  correctedMatrix: number[][];
  cronbachAlpha: number;
	sem: number;
	mean: number;
	variance: number;
	standardDeviation: number;
  reliability: number;
  discrimination: number;
};
