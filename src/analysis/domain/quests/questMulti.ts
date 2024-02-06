import { ItemMulti } from "../items/itemsMulti";
import { DirectVsBlank } from "../plots/directVsBlank";
import { DirectVsCoherency } from "../plots/directVsCoherency";
import { DirectVsMCI } from "../plots/directVsMci";
import { DirectVsWeighted } from "../plots/directVsWeighted";
import { HealthProblemsGradu } from "../plots/healthProblemsGradu";
import { ItemFrequency } from "../plots/itemFrequency";
import { ItemMap } from "../plots/itemsMap";
import { Reliability } from "../plots/reliability";
import { ScoreDistribution } from "../plots/scoreDistribution";
import { UserMulti } from "../users/usersMulti";

export class questMulti {
	// Rows: Users
	// Columns: Items
	private omissions: Set<string> = new Set(['*', '']);
	private cronbachAlpha: number = undefined!;
	private sem: number = undefined!;
	private mean: number = undefined!;
	private variance: number = undefined!;
	private standardDeviation: number = undefined!;

	private reliability: number = undefined!;
	private discrimination: number = undefined!;
	private keyConflict: number = undefined!;
	private choice: number = undefined!;
	private coherency: number = undefined!;

	// TODO: check move this to userMulti
	private weightScore: number[] = undefined!;

	private difficulty: number = undefined!;
	private testHealth: number = undefined!;

	private originalMatrix: string[][];
	private matrix: string[][] = undefined!;
	private correctedMatrix: number[][] = undefined!;
	private originalKeys: string[];
	private keys: string[];
	private scale: number;
	private numberOfAnswers: number[];
	private items: ItemMulti;
	private users: UserMulti;
	private activeItems: boolean[];
	private activeUsers: boolean[];



	constructor(
		matrix: string[][],
		correctAnswers: string[],
		scale: number,
		numberOfAnswers: number[]
	) {
		matrix = matrix.map(row =>
			row.map(answer => (this.omissions.has(answer) ? 'X' : answer.toUpperCase()))
		);
		correctAnswers = correctAnswers.map(answer => answer.toUpperCase());

		this.originalMatrix = matrix;
		this.originalKeys = correctAnswers;
		this.keys = correctAnswers;
		this.scale = scale;
		this.numberOfAnswers = numberOfAnswers;
		this.activeUsers = Array.from({ length: matrix.length }, () => true);
		this.activeItems = Array.from({ length: matrix[0].length }, () => true);

		this.createMatrix();

		this.items = new ItemMulti(this.matrix, this.correctedMatrix, numberOfAnswers, correctAnswers);
		this.users = new UserMulti(this.matrix, this.correctedMatrix);
		this.calculate();
	}

	private createMatrix(): void {

		const originalMatrix = this.originalMatrix;

		const filteredColumnsMatrix = originalMatrix.map(row =>
			row.filter((_, columnIndex) => this.activeItems[columnIndex])
		);

		const filteredMatrix = filteredColumnsMatrix.filter((_, rowIndex) => this.activeUsers[rowIndex]);

		this.matrix = filteredMatrix;
		this.correctedMatrix = this.correctMatrix(this.matrix);
	}

	private correctMatrix(matrix: string[][]): number[][] {
		// TODO: check 1 si el usuario acierta, 0 si no responde o falla
		const correctedMatrix = matrix.map(row =>
			row.map((answer, columnIndex) => {
				const correctAnswer = this.keys[columnIndex];
				if (answer === correctAnswer) {
					return 1;
				} else {
					return 0;
				}
			})
		);
		return correctedMatrix;
	}

	private calculate(): void {
		this.users.calculate();

		this.calculateMean()
		this.calculateVariance();

		this.items.calculate(this.users.directScoreValue, this.variance);

		this.calculateWeightScore();

		this.calculateStandardDeviation();
		this.calculateCronbachAlpha();
		this.calculateSEM();
		this.calculateReliabilityValue();
		this.calculateDiscrimination();
		this.calculateKeyConflict();  //TODO: BAD
		this.calculateChoice();
		this.calculateCoherency();  //TODO: BAD
		this.calculateDifficulty();  //TODO: BAD
		this.calculateTestHealth();  //TODO: BAD


	}

	private calculateWeightScore(): void {
		this.weightScore = []

		for (const vector of this.correctedMatrix) {
			const puntuacionSujeto = vector.reduce((acumulado, valor, indice) => {
				return acumulado + (valor === 0 ? 0 : this.items.discriminationValue[indice]);
			}, 0);

			this.weightScore.push(puntuacionSujeto);
		}
	}

	private calculateMean(): void {
		this.mean = this.users.directScoreValue.reduce((acc, value) => acc + value, 0) / this.users.directScoreValue.length;

	}

	private calculateVariance(): void {
		const score: number[] = this.users.directScoreValue;
		this.variance = score.reduce((acc, value) => acc + (value - this.mean) ** 2, 0) / (score.length - 1);
	}

	private calculateStandardDeviation(): void {
		this.standardDeviation = Math.sqrt(this.variance);
	}


	private calculateCronbachAlpha(): void {
		const nItems = this.correctedMatrix[0].length;
		const itemVar = this.items.varianceValue.reduce((acc, value) => acc + value, 0);

		if (nItems > 1) {
			this.cronbachAlpha = (nItems / (nItems - 1)) * (1 - itemVar / this.variance);
		} else {
			this.cronbachAlpha = 0;
		}
	}

	private calculateSEM(): void {
		this.sem = this.standardDeviation * Math.sqrt(1 - this.cronbachAlpha);
	}

	private calculateReliabilityValue(): void {
		this.reliability = this.cronbachAlpha;
	}

	private calculateDiscrimination(): void {
		// obtiene el valor de discriminacion de los items, calcula el numero cuya discriminacion es > 0.3 y lo divide entre el numero total de items
		this.discrimination = this.items.discriminationValue.filter(value => value > 0.3).length / this.items.discriminationValue.length;
	}

	private calculateKeyConflict(): void {
		// obtiene el valor de conflicto de los items, calcula el numero de veces que aparece un false y lo divide entre el numero total de items
		if (this.numberOfAnswers[0] === 2) {
			return;
		}
		this.keyConflict = this.items.conflictValue.filter(value => value === true).length / this.items.conflictValue.length;
	}

	private calculateChoice(): void {
		// obtiene el valor de eleccion de los items, calcula el numero de veces que aparece un true y lo divide entre el numero total de items
		if (this.numberOfAnswers[0] > 2) {
			this.choice = this.items.choiceValue.filter(value => value === true).length / this.items.choiceValue.length;
		}
	}

	private calculateCoherency(): void {
		// obtiene el valor de MCI de los sujetos, calcula el numero de veces que MCI < 0.5 y lo divide entre el numero total de sujetos)
		this.coherency = this.users.mciValue.filter(value => value < 0.5).length / this.users.mciValue.length;
	}

	private calculateDifficulty(): void {
		// calcula la media de dificultad de los items y la multiplica por 100
		this.difficulty = this.items.difficultyValue.reduce((acc, value) => acc + value, 0) / this.items.difficultyValue.length;
	}

	private calculateTestHealth(): void {
		// calcula la media de salud del test y la multiplica por 100
		if (this.numberOfAnswers[0] > 2) {
			this.testHealth = (this.reliability + this.discrimination + this.keyConflict + this.choice + this.coherency) / 5;
		} else {
			this.testHealth = (this.reliability + this.discrimination + this.keyConflict + this.coherency) / 4;
		}
	}

	public get originalKeysValue(): string[] {return this.originalKeys}

	public get keysValue(): string[] {return this.keys}

	public get cronbachAlphaValue(): number {return this.cronbachAlpha}

	public get semValue(): number {return this.sem}

	public get meanValue(): number {return this.mean}

	public get varianceValue(): number {return this.variance}

	public get standardDeviationValue(): number {return this.standardDeviation}

	public get reliabilityValue(): number {return this.reliability}

	public get discriminationValue(): number {return this.discrimination}

	public get keyConflictValue(): number {return this.keyConflict}

	public get choiceValue(): number {return this.choice}

	public get coherencyValue(): number {return this.coherency}

	public get difficultyValue(): number {return this.difficulty}

	public get testHealthValue(): number {return this.testHealth}

	public get scaleValue(): number {return this.scale}

	public calculateReliability(): Reliability {
		const x: number[] = Array.from({ length: 11 }, (_, i) => 0.5 + i * 0.1);
		return new Reliability(x.map((k) => (k * this.cronbachAlpha) / (1 + (k - 1) * this.cronbachAlpha)));
	}

	public getItemsMap(): ItemMap {
		return new ItemMap(
			this.items.idValue,
			this.items.discriminationValue,
			this.items.difficultyValue,
		);
	}

	public directVsWeighted(): DirectVsWeighted {
		return new DirectVsWeighted(
			this.users.directScoreValue,
			this.weightScore,
		);
	}

	public directVsBlankAnswer(): DirectVsBlank {
		return new DirectVsBlank(
			this.users.directScoreValue,
			this.users.blankAnswersValue,
		);
	}

	public directVsCoherency(): DirectVsCoherency {
		return new DirectVsCoherency(
			this.users.directScoreValue,
			this.users.coherenceValue,
		);
	}

	public directVsMCI(): DirectVsMCI {
		return new DirectVsMCI(
			this.users.directScoreValue,
			this.users.mciValue,
		);
	}

	public scoreDistribution(): ScoreDistribution {
		return new ScoreDistribution(
			this.users.directScoreValue,
		);

	}

	public getHealthProblems(): HealthProblemsGradu {
		return new HealthProblemsGradu(
			this.choice,
			this.discrimination,
			this.cronbachAlpha,
			this.coherency,
			this.keyConflict,
		);
	}

	public getItemsTable(): Map<string, any> {
		const itemsTable = new Map<string, any>();
		itemsTable.set("id", this.items.idValue);
		itemsTable.set("Conflict", this.items.conflictValue);
		itemsTable.set("Graph", this.items.idValue);
		itemsTable.set("Deactivate", this.items.idValue);
		itemsTable.set("Key", this.items.keyValue);
		if (this.numberOfAnswers[0] > 2) {
			itemsTable.set("Choice", this.items.choiceValue);
		}
		itemsTable.set("Difficulty", this.items.difficultyValue);
		itemsTable.set("Variance", this.items.varianceValue);
		itemsTable.set("Discrimination", this.items.discriminationValue);
		itemsTable.set("Corr Disc", this.items.correctDiscriminationValue);
		const alternativeDiscrimination = this.items.alternativeDiscriminationValue;
		alternativeDiscrimination.forEach((value, key) => itemsTable.set(key, value));
		const alternativeDifficulty = this.items.alternativeDifficultyValue;
		alternativeDifficulty.forEach((value, key) => itemsTable.set(key, value));

		return itemsTable;
	}

	public getExamineesTable(): Map<string, any> {
		const usersTable = new Map<string, any>();
		usersTable.set("id", this.users.idValue);
		usersTable.set("Deactivate", this.users.idValue);
		usersTable.set("Direct Score", this.users.directScoreValue);
		usersTable.set("Weighted Score", this.weightScore);
		usersTable.set("Coherence", this.users.coherenceValue);
		usersTable.set("Mean", this.users.meanValue);
		usersTable.set("TotalScore", this.users.totalScoreValue);
		usersTable.set("Blank Answer", this.users.blankAnswersValue);
		usersTable.set("MCI", this.users.mciValue);

		return usersTable;
	}

	public getItemFrequency(id: number): ItemFrequency {
		return this.items.calculateFrequency(id);
	}

	public getItemProfile(id: number): any {
		return this.items.calculateProfile(id);
	}

	public getItemDiscrimination(id: number): any {
		return this.items.calculateDiscrimination(id);
	}

	public updateItemsKey(id: number, key: string): void {
		this.keys[id] = key.toUpperCase();
		this.items.update(this.matrix, this.correctedMatrix, this.keys);
	}

	public deactivateItems(id: number): void {
		this.activeItems[id] = false;
		this.createMatrix();
		this.items.update(this.matrix, this.correctedMatrix, this.keys);
		this.users.update(this.matrix, this.correctedMatrix);
	}

	public activateItems(id: number): void {
		this.activeItems[id] = true;
		this.createMatrix();
		this.items.update(this.matrix, this.correctedMatrix, this.keys);
		this.users.update(this.matrix, this.correctedMatrix);
	}

	public deactivateExaminees(id: number): void {
		this.activeUsers[id] = false;
		this.createMatrix();
		this.items.update(this.matrix, this.correctedMatrix, this.keys);
		this.users.update(this.matrix, this.correctedMatrix);
	}

	public activateExaminees(id: number): void {
		this.activeUsers[id] = true;
		this.createMatrix();
		this.items.update(this.matrix, this.correctedMatrix, this.keys);
		this.users.update(this.matrix, this.correctedMatrix);
	}
}
