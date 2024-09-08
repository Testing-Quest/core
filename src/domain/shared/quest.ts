export type QuestType = {
  uuid: string;
	keys: string[];
	scale: number;
	alternatives: number[];
	matrix: string[][];
	type: 'gradu' | 'multi' | 'binary';
	rows: number;
	columns: number;
}
