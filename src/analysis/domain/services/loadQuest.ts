import * as XLSX from 'xlsx';

interface QuestData {
	usersID: string[]; // First column
	key: string[];  // First row
	scales: string[]; // Second row
	alternatives: string[]; // Third row
	matrix: string[][]; // Rest of the rows
}

/* Exmaple of data
[
	['', 'Q1', 'Q2', 'Q3'],
	['', 'S1', 'S2', 'S3'],
	['', 'A1', 'A2', 'A3'],
	['U1', '1', '2', '3'],
	['U2', '4', '5', '6'],
	['U3', '7', '8', '9'],
]

usersID = ['U1', 'U2', 'U3']
key = ['Q1', 'Q2', 'Q3']
scales = ['S1', 'S2', 'S3']
alternatives = ['A1', 'A2', 'A3']
matrix = [
	['1', '2', '3'],
	['4', '5', '6'],
	['7', '8', '9'],
]
*/

async function loadQuest(file: File): Promise<QuestData> {

	const workbook = XLSX.read(await file.arrayBuffer());
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
	
	const usersID = data.slice(3).map(row => row[0]);
	const key = data[0].slice(1);
	const scales = data[1].slice(1);
	const alternatives = data[2].slice(1);
	const matrix = data.slice(3).map(row => row.slice(1));
	console.log(usersID, key, scales, alternatives, matrix);

	return { usersID, key, scales, alternatives, matrix };
}

export default loadQuest;



