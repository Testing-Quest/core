export const QuestType = {
	gradu: "Gradu",
	multi: "Multi",
	binary: "V/F",
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
