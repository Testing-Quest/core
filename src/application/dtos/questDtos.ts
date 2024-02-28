export const QuestType = {
	gradu: "Graduado",
	multi: "Multirespuesta",
	binary: "Binario",
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
