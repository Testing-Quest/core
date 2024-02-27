export const QuestType = {
	gradu: 1,
	multi: 2,
}

export interface QuestData {
	keys: string[];
	scale: number;
	alternatives: number[];
	matrix: string[][];
	type: typeof QuestType[keyof typeof QuestType];
	rows: number;
	columns: number;
}
