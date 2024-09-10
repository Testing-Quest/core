export type NewQuestType = {
  uuid: string;
  keys: string[];
  scale: number;
  alternatives: number[];
  matrix: string[][];
  type: 'gradu' | 'multi' | 'binary';
};

export type QuestType = {
  uuid: string;
  type: 'gradu' | 'multi' | 'binary';
  scale: number;
  directScore: number[];
  numberOfAnswers: number;
  correctedMatrix: number[][];
  cronbachAlpha: number;
	sem: number;
	mean: number;
	variance: number;
	standardDeviation: number;
  reliability: number;
  discrimination: number;
  testHealth: number;
};

