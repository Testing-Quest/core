import { ItemDiscrimination } from "../plots/itemDiscrimination";
import { ItemFrequency } from "../plots/itemFrequency";
import { ItemProfile } from "../plots/itemProfile";


const Alternatives: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"];

const DiccionarioTablaChiCuadrado: Map<number, number> = new Map([
	[3, 5.99],
	[4, 7.81],
	[5, 9.48],
	[6, 11.07],
	[7, 12.59],
	[8, 14.07],
	[9, 15.51],
	[10, 16.92]
]);

export class ItemGradu {
	private id: number[];
	private alternatives: number;
	private matrix: string[][];
	private correctedMatrix: number[][];
	private mean: number[] = undefined!;
	private conflict: boolean[] = undefined!;
	private key: string[] = undefined!;
	private choice: boolean[] = undefined!;
	private difficulty: number[] = undefined!;
	private variance: number[] = undefined!;
	private discrimination: number[] = undefined!;
	private correctDiscrimination: number[] = undefined!;
	private usersDirectScore: number[] = undefined!;
	private questVariance: number = undefined!;
	private itemsDirectScore: number[] = undefined!;

	private alternativeDiscrimination: Map<string, number[]> = undefined!;
	private alternativeDifficulty: Map<string, number[]> = undefined!;


	constructor(
		matrix: string[][],
		correctMatrix: number[][],
		numberOfAnswer: number[],
		key: string[],
	) {
		this.id = Array.from({ length: key.length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctMatrix;
		this.alternatives = numberOfAnswer[0];
		this.key = key;
	}

	public update(
		matrix: string[][],
		correctedMatrix: number[][],
		key: string[],
	): void {
		this.id = Array.from({ length: key.length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
		this.key = key;
	}

	public calculate(
		usersDirectScore: number[],
		questVariance: number,
	): void {
		this.usersDirectScore = usersDirectScore;
		this.questVariance = questVariance;
		this.calculateItemsDirectScore(); 
		this.calculateMean();  
		this.calculateVariance();  
		this.calculateDiscriminationValue(); 
		this.calculateDifficulty();  
		this.calculateCorrectDiscrimination(); 
		this.calculateAlternativeDiscriminationDifficulty(); 
		this.calculateConflict();  
		this.calculateChoice();  

		this.matrix = undefined!;
		this.correctedMatrix = undefined!;
	}

	private calculateItemsDirectScore(): void {
		const numItems = this.correctedMatrix[0].length;
		this.itemsDirectScore = Array.from({ length: numItems }, (_, colIndex) =>
			this.correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0)
		);
	}

	private calculateMean(): void {
		const numRows = this.correctedMatrix.length;
		const numCols = this.correctedMatrix[0].length;

		this.mean = Array.from({ length: numCols }, (_, colIndex) =>
			this.correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0) / numRows
		);
	}

	private calculateVariance(): void {
		const numRows = this.correctedMatrix.length;
		const numCols = this.correctedMatrix[0].length;

		this.variance = Array.from({ length: numCols }, (_, colIndex) =>
			this.correctedMatrix.reduce((acc, row) => acc + (row[colIndex] - this.mean[colIndex]) ** 2, 0) / (numRows - 1)
		);
	}

	private calculateDiscriminationValue(): void {
		this.discrimination = Array.from({ length: this.id.length }, (_, i) => {
			const item = this.correctedMatrix.map(row => row[i]);
			return this.calculatePearson(item, this.usersDirectScore);
		});
	}

	private calculatePearson(item: number[], totalScore: number[]): number { 
		const n = item.length;
		const sumItem = item.reduce((prev, curr) => prev + curr, 0);
		const sumTotalScore = totalScore.reduce((prev, curr) => prev + curr, 0);
		const sumItemTotalScore = item.reduce((prev, curr, index) => prev + curr * totalScore[index], 0);
		const sumItemSquared = item.reduce((prev, curr) => prev + curr ** 2, 0);
		const sumTotalScoreSquared = totalScore.reduce((prev, curr) => prev + curr ** 2, 0);

		const numerator = n * sumItemTotalScore - sumItem * sumTotalScore;
		const denominator = Math.sqrt(
			(n * sumItemSquared - sumItem ** 2) * (n * sumTotalScoreSquared - sumTotalScore ** 2)
		);

		return numerator / denominator;
	}



	private calculateDifficulty(): void {
		this.difficulty = this.itemsDirectScore.map((item) => {
			const numUsers = this.matrix.length;
			if (numUsers === 0) {
				return 0;
			}
			return item / numUsers;
		});
	}

	private calculateCorrectDiscrimination(): void {

		this.correctDiscrimination = this.discrimination.map((value, index) => {
			const numerator = value * this.questVariance - this.variance[index];
			const denominator = Math.sqrt(this.questVariance ** 2 + this.variance[index] ** 2 - 2 * value * this.questVariance * this.variance[index]);
			return numerator / denominator;
		});
	}


	private calculateAlternativeDiscriminationDifficulty(): void {
		if (this.alternatives === 2) {
			return;
		}
		
		const totalUsers = this.matrix.length;

		this.alternativeDiscrimination = new Map<string, number[]>();
		this.alternativeDifficulty = new Map<string, number[]>();

		const calculateDisrimination = (matrix: number[][]) => {
			return Array.from({ length: matrix[0].length }, (_, i) => {	
				const item = matrix.map(row => row[i]);
				return this.calculatePearson(item, this.usersDirectScore);
			});
		};

		const calculateDifficulty = (directScore: number[]) =>
			directScore.map((item) => item / totalUsers);

		const processAlternative = (alternative: string) => {
			const correctedMatrix = this.matrix.map(row => row.map(item => +(item === alternative)));
			const itemsDirectScore = Array.from({ length: correctedMatrix[0].length }, (_, colIndex) =>
				correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0)
			);

			this.alternativeDiscrimination.set(`Discrimination ${alternative}`, calculateDisrimination(correctedMatrix));
			this.alternativeDifficulty.set(`Difficulty ${alternative}`, calculateDifficulty(itemsDirectScore));
		};

		for (let i = 0; i < this.alternatives; i++) {
			const alternative = Alternatives[i];
			processAlternative(alternative);
		}
		processAlternative("X");
	}

	private calculateConflict(): void {
		if (this.alternatives === 2) {
			return;
		}
		const alternativeDiscrimination = Array.from(this.alternativeDiscrimination.values());
		this.conflict = this.discrimination.map((value, index) => {
			const alternativeDiscriminationItem: number[] = alternativeDiscrimination.map(row => row[index]);
			return value > Math.max(...alternativeDiscriminationItem);
		});
	}

	private calculateChoice(): void {
		if (this.alternatives <= 3) {
			return;
		}
		this.choice = [];

		const frequencies: Map<string, number[]> = new Map();

		for (const [difficulty, freqs] of this.alternativeDifficulty) {
			frequencies.set(difficulty, Array.from(freqs, freq => freq * this.usersDirectScore.length));
		}

		const getFrequencies = (key: string, index: number) => {
			const result: number[] = [];
			for (const [difficulty, freqs] of frequencies) {
				if (difficulty !== 'Difficulty X' && difficulty !== `Difficulty ${key}`) {
					result.push(freqs[index]);
				}
			}
			return result;
		};

		const calculateChiCuadrado = (itemFrequencies: number[], freqEsperada: number): number => {
			return itemFrequencies.reduce((acc, freq) => acc + Math.pow(freq - freqEsperada, 2) / freqEsperada, 0);
		};

		for (let i = 0; i < this.key.length; i++) {
			const itemKey: string = this.key[i];
			const itemFrequencies: number[] = getFrequencies(itemKey, i);
			const numRespuestas: number = itemFrequencies.reduce((a, b) => a + b, 0);

			const freqEsperada: number = numRespuestas / (this.alternatives - 1);

			const chiCuadrado: number = calculateChiCuadrado(itemFrequencies, freqEsperada);

			this.choice.push(chiCuadrado < DiccionarioTablaChiCuadrado.get(this.alternatives - 1)!);
		}
	}

	public get idValue(): number[] { return this.id }

	public get conflictValue(): boolean[] { return this.conflict }

	public get keyValue(): string[] { return this.key }

	public get choiceValue(): boolean[] { return this.choice }

	public get difficultyValue(): number[] { return this.difficulty }

	public get varianceValue(): number[] { return this.variance }

	public get discriminationValue(): number[] { return this.discrimination }

	public get correctDiscriminationValue(): number[] { return this.correctDiscrimination }

	public get alternativeDiscriminationValue(): Map<string, number[]> { return this.alternativeDiscrimination }

	public get alternativeDifficultyValue(): Map<string, number[]> { return this.alternativeDifficulty }

	public calculateFrequency(id: number): ItemFrequency {
		const alternativeDifficulty: Map<string, number> = new Map(
			Array.from(this.alternativeDifficulty.entries()).map(([key, value]) => [
				key.split(" ")[1],
				value[id]
			])
		);
		return new ItemFrequency(alternativeDifficulty);
	}

	public calculateDiscrimination(id: number): ItemDiscrimination {
		const alternativeDiscrimination: Map<string, number> = new Map(
			Array.from(this.alternativeDiscrimination.entries()).map(([key, value]) => [
				key.split(" ")[1],
				value[id]
			])
		);
		return new ItemDiscrimination(alternativeDiscrimination);
	}

	public calculateProfile(row: string[]): ItemProfile {
		return new ItemProfile(row, this.usersDirectScore);
	}
}

