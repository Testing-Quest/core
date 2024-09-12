import { ItemGradu } from "./GraduItems";
import { HealthProblemsGradu } from "../plots/healthProblemsGradu";
import { ItemFrequency } from "../plots/itemFrequency";
import { DirectVsBlank } from "../plots/directVsBlank";
import { ItemProfile } from "../plots/itemProfile";
import { ItemMap } from "../plots/itemsMap";
import { Reliability } from "../plots/reliability";
import { ScoreDistribution } from "../plots/scoreDistribution";
import { UserGradu } from "./GraduUsers";

export class questGradu {
	// Rows: Users
	// Columns: Items
	private omissions: Set<string> = new Set(['*', 'X', 'x', '']);
	private cronbachAlpha: number = undefined!;
	private sem: number = undefined!;
	private mean: number = undefined!;
	private variance: number = undefined!;
	private standardDeviation: number = undefined!;

	private score: number = undefined!;
	private reliability: number = undefined!;
	private discrimination: number = undefined!;
	private variability: number = undefined!;
	private testHealth: number = undefined!;

	private originalMatrix: number[][];
	private matrix: number[][] = undefined!;
	private correctedMatrix: number[][] = undefined!;
	private originalKeys: string[];
	private keys: string[];
	private scale: number;
	private numberOfAnswers: number[];
	private items: ItemGradu;
	private users: UserGradu;
	private activeItems: boolean[];
	private activeUsers: boolean[];



	constructor(
		matrix: string[][],
		correctAnswers: string[],
		scale: number,
		numberOfAnswers: number[]
	) {
		const integerMatrix: number[][] = matrix.map(row =>
			row.map(answer => (this.omissions.has(answer) ? 0 : parseInt(answer)))
		);

		this.originalMatrix = integerMatrix;
		this.originalKeys = correctAnswers;
		this.keys = correctAnswers;
		this.scale = scale;
		this.numberOfAnswers = numberOfAnswers;
		this.activeUsers = Array.from({ length: matrix.length }, () => true);
		this.activeItems = Array.from({ length: matrix[0].length }, () => true);

		this.createMatrix();

		this.items = new ItemGradu(this.correctedMatrix, numberOfAnswers);
		this.users = new UserGradu(this.correctedMatrix);
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

	private correctMatrix(matrix: number[][]): number[][] {
		return matrix.map(row =>
			row.map((answer: number, columnIndex: number) => {
				if (this.keys[columnIndex] === "-" && answer != 0) {
					return this.numberOfAnswers[columnIndex] - answer + 1
				}
				return answer
			})
		);
	}

	private calculate(): void {
		this.users.calculate();

		this.calculateMean()
		this.calculateVariance();

		this.items.calculate(this.users.directScoreValue, this.variance);


		this.calculateStandardDeviation();
		this.calculateCronbachAlpha();
		this.calculateSEM();
		this.calculateReliabilityValue();
		this.calculateScore();
		this.calculateVariability();
		this.calculateDiscrimination();
		this.calculateTestHealth();
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
		const itemVar = this.items.standartDeviationValue.reduce((acc, value) => acc + value, 0);

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


	private calculateScore(): void {
		this.score = this.correctedMatrix.reduce((acc, r) => acc + r.reduce((acc, value) => acc + value, 0), 0) / (this.correctedMatrix.length * this.correctedMatrix[0].length)
	}

	private calculateVariability(): void {
		const variability: number = this.numberOfAnswers[0] / 10
		this.variability = this.items.standartDeviationValue.reduce((acc, r) => acc + (r > variability ? 1 : 0), 0) / this.correctedMatrix[0].length
	}

	private calculateDiscrimination(): void {
		this.discrimination = this.items.discriminationValue.filter(value => value > 0.3).length / this.items.discriminationValue.length;
	}


	private calculateTestHealth(): void {
		this.testHealth = (this.variability + this.discrimination + this.reliability) / 3
	}

	public get originalKeysValue(): string[] { return this.originalKeys }

	public get keysValue(): string[] { return this.keys }

	public get cronbachAlphaValue(): number { return this.cronbachAlpha }

	public get semValue(): number { return this.sem }

	public get meanValue(): number { return this.mean }

	public get varianceValue(): number { return this.variance }

	public get standardDeviationValue(): number { return this.standardDeviation }

	public get reliabilityValue(): number { return this.reliability }

	public get discriminationValue(): number { return this.discrimination }

	public get testHealthValue(): number { return this.testHealth }

	public get scaleValue(): number { return this.scale }

	public get scoreValue(): number { return this.score }

	public get variablityValue(): number { return this.variability }

	public calculateReliability(): Reliability {
		const x: number[] = Array.from({ length: 11 }, (_, i) => 0.5 + i * 0.1);
		return new Reliability(x, x.map((k) => (k * this.cronbachAlpha) / (1 + (k - 1) * this.cronbachAlpha)));
	}

	public getItemsMap(): ItemMap {
		return new ItemMap(
			this.items.idValue,
			this.items.discriminationValue,
			this.items.difficultyValue,
		);
	}

	public scoreDistribution(): ScoreDistribution {
		return new ScoreDistribution(
			this.users.directScoreValue,
		);

	}

	public directVsBlankAnswer(): DirectVsBlank {
		return new DirectVsBlank(
			this.users.idValue,
			this.users.directScoreValue,
			this.users.blankAnswersValue,

		);
	}

	public getHealthProblems(): HealthProblemsGradu {
		return new HealthProblemsGradu(
			this.variability,
			this.discrimination,
			this.reliability
		);
	}

	public getItemsTable(): Map<string, any> {
		const itemsTable = new Map<string, any>();
		itemsTable.set("id", this.items.idValue);
		itemsTable.set("Graph", this.items.idValue);
		itemsTable.set("Deactivate", this.items.idValue);
		itemsTable.set("Variance", this.items.standartDeviationValue);
		itemsTable.set("Discrimination", this.items.discriminationValue);
		itemsTable.set("Corr Disc", this.items.correctDiscriminationValue);
		const alternativeDifficulty = this.items.alternativeDifficultyValue;
		alternativeDifficulty.forEach((value, key) => itemsTable.set(key, value));

		return itemsTable;
	}

	public getExamineesTable(): Map<string, (string | number)[]> {
		const usersTable = new Map<string, (string | number)[]>();
		usersTable.set("id", this.users.idValue);
		usersTable.set("Deactivate", this.users.idValue);
		usersTable.set("Direct Score", this.users.directScoreValue);
		usersTable.set("Mean", this.users.meanValue);
		usersTable.set("TotalScore", this.users.totalScoreValue);
		usersTable.set("Blank Answer", this.users.blankAnswersValue);

		return usersTable;
	}

	public getItemFrequency(id: number): ItemFrequency {
		return this.items.calculateFrequency(id);
	}

	public getItemProfile(id: number): ItemProfile {
		return this.items.calculateProfile(this.matrix.map(row => row[id].toString()));
	}

	public updateItemsKey(id: number, key: string): void {
		this.keys[id] = key.toUpperCase();
	}

	public deactivateItems(id: number): void {
		this.activeItems[id] = false;
	}

	public activateItems(id: number): void {
		this.activeItems[id] = true;
	}

	public deactivateExaminees(id: number): void {
		this.activeUsers[id] = false;
	}

	public activateExaminees(id: number): void {
		this.activeUsers[id] = true;
	}

	public async recalculate(): Promise<void> {
		this.createMatrix();
		this.items.update(this.correctedMatrix);
		this.users.update(this.correctedMatrix);
		this.createMatrix();
		this.calculate();
	}

	public inactiveItems(): number[] {
		return this.activeItems
			.map((value, index) => (value === false ? index : null))
			.filter((position): position is number => position !== null);
	}

	public inactiveUsers(): number[] {
		return this.activeUsers
			.map((value, index) => (value === false ? index : null))
			.filter((position): position is number => position !== null);
	}

	public isModified(): boolean {
		const activeUsers = this.activeUsers.every(value => value === true);
		const activeItems = this.activeItems.every(value => value === true);
		const correctKeys = this.keys.every((value, index) => value === this.originalKeys[index]);
		return !activeUsers || !activeItems || !correctKeys;
	}

	public async reset(): Promise<void> {
		this.keys = this.originalKeys;
		this.activeItems = Array.from({ length: this.originalMatrix[0].length }, () => true);
		this.activeUsers = Array.from({ length: this.originalMatrix.length }, () => true);
		this.createMatrix();
		await this.recalculate();
	}

	public getType(): string {
		return "gradu";
	}

	public getNumberOfAnswers(): number {
		return this.numberOfAnswers[0];
	}
}
