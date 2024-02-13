import * as XLSX from 'xlsx';

export const QuestType = {
	gradu: 1,
	multi: 2,
}

interface Quest {
	usersID: number[];
	keys: string[];
	scales: number[];
	alternatives: number[];
	matrix: string[][];
}

export interface QuestData {
	usersID: number[];
	keys: string[];
	scale: number;
	alternatives: number[];
	matrix: string[][];
	type: typeof QuestType[keyof typeof QuestType];
	rows: number;
	columns: number;
}

export class FirstColumnsThreeRowsNotEmptyError extends Error {
	constructor() {
		console.log('FirstColumnsThreeRowsNotEmptyError');
		super('The first three rows of the first columns must be empty');
	}
}

export class FirstRowNotContainsAlphabeticCharactersError extends Error {
	constructor() {
		console.log('FirstRowNotContainsAlphabeticCharactersError');
		super('The first row must contain alphabetic characters [A-z] or [+ -]');
	}
}

export class SecondRowNotContainsNumbersError extends Error {
	constructor() {
		console.log('SecondRowNotContainsNumbersError');
		super('The second row must contain numbers');
	}
}

export class ThirdRowNotContainsNumbersError extends Error {
	constructor() {
		console.log('ThirdRowNotContainsNumbersError');
		super('The third row must contain numbers');
	}
}

export class FirstColumnNotContainsNumbersError extends Error {
	constructor() {
		console.log('FirstColumnNotContainsNumbersError');
		super('The first column must contain numbers');
	}
}

async function loadQuest(file: File): Promise<QuestData[]> {

	const workbook = XLSX.read(await file.arrayBuffer());
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

	// check if the positions [0,0], [1,0], [2,0] are empty
	const emptyPositions = [data[0][0], data[1][0], data[2][0]].filter(cell => cell !== undefined);
	if (emptyPositions.length > 0 && emptyPositions.length < 3) {
		throw new FirstColumnsThreeRowsNotEmptyError();
	}

	// check if the second row contains numbers
	const secondRow = data[1].slice(1);
	const secondRowNotContainsNumbers = secondRow.some(cell => isNaN(Number(cell)));
	if (secondRowNotContainsNumbers) {
		throw new SecondRowNotContainsNumbersError();
	}
	// check if the third row contains numbers
	const thirdRow = data[2].slice(1);
	const thirdRowNotContainsNumbers = thirdRow.some(cell => isNaN(Number(cell)));
	if (thirdRowNotContainsNumbers) {
		throw new ThirdRowNotContainsNumbersError();
	}

	var usersID: number[]
	var keys: string[]
	var scales: number[]
	var alternatives: number[]
	var matrix: string[][]

	if (emptyPositions.length === 3) {
		// usersID = lenght of the first columns - 3
		const length = data.length - 3;
		usersID = Array.from({ length }, (_, i) => i + 1);
		keys = data[0].map(cell => cell.trim());
		scales = data[1].map(Number);
		alternatives = data[2].map(Number);
		matrix = data.slice(3);
	} else {
		usersID = data.slice(3).map(row => parseInt(row[0]));
		keys = data[0].slice(1).map(cell => cell.trim());
		scales = data[1].slice(1).map(Number);
		alternatives = data[2].slice(1).map(Number);
		matrix = data.slice(3).map(row => row.slice(1));
	}

	// drop undefined rows in the matrix
	matrix = matrix.filter(row => row[0] !== undefined);
	usersID = usersID.filter(user => !isNaN(user) && user !== undefined);
	keys = keys.filter(key => key !== undefined);
	scales = scales.filter(scale => !isNaN(scale) && scale !== undefined);
	alternatives = alternatives.filter(alternative => !isNaN(alternative) && alternative !== undefined);

	// check matrix length is equal to usersID length
	if (matrix.length !== usersID.length) {
		console.log(matrix.length, usersID.length);
		throw new FirstColumnNotContainsNumbersError();
	}

	if (matrix[0].length !== keys.length) {
		throw new Error('The matrix length is not equal to the keys length');
	}

	if (matrix[0].length !== scales.length) {
		throw new Error('The matrix length is not equal to the scales length');
	}

	if (matrix[0].length !== alternatives.length) {
		throw new Error('The matrix length is not equal to the alternatives length');
	}

	if (keys.some(cell => !/^[A-z+ -]+$/.test(cell))) {
		throw new FirstRowNotContainsAlphabeticCharactersError();
	}
	return generateQuestsData({ usersID, keys, scales, alternatives, matrix });
}

function generateQuestsData(data: Quest): QuestData[] {
	const questsData: QuestData[] = [];
	const scales = Array.from(new Set(data.scales));
	scales.forEach(scale => {
		const indexes = data.scales.map((s, i) => s === scale ? i : -1).filter(i => i !== -1);
		const matrix = data.matrix.map(row => indexes.map(i => row[i].toString().trim()));
		const keys = indexes.map(i => data.keys[i]);
		const type = keys[0][0] === '+' || keys[0][0] === '-' ? QuestType.gradu : QuestType.multi;
		const alternatives = indexes.map(i => data.alternatives[i]);
		questsData.push({ usersID: data.usersID, keys, scale, alternatives, matrix, type, rows: matrix.length, columns: matrix[0].length });
	});
	return questsData;
}


export default loadQuest;



