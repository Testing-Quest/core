import * as XLSX from 'xlsx';

export interface QuestData {
	usersID: number[];
	key: string[];
	scales: number[];
	alternatives: number[];
	matrix: string[][];
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

async function loadQuest(file: File): Promise<QuestData> {

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
	var key: string[]
	var scales: number[]
	var alternatives: number[]
	var matrix: string[][]

	if (emptyPositions.length === 3) {
		// usersID = lenght of the first columns - 3
		const length = data.length - 3;
		usersID = Array.from({ length }, (_, i) => i + 1);
		key = data[0].map(cell => cell.trim());
		scales = data[1].map(Number);
		alternatives = data[2].map(Number);
		matrix = data.slice(3);
	} else {
		usersID = data.slice(3).map(row => parseInt(row[0]));
		key = data[0].slice(1).map(cell => cell.trim());
		scales = data[1].slice(1).map(Number);
		alternatives = data[2].slice(1).map(Number);
		matrix = data.slice(3).map(row => row.slice(1));
	}
	if (key.some(cell => !/^[A-z+ -]+$/.test(cell))) {
		throw new FirstRowNotContainsAlphabeticCharactersError();
	}
	return { usersID, key, scales, alternatives, matrix };
}


export default loadQuest;



