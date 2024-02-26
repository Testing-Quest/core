import { ItemFrequency } from "../plots/itemFrequency";
import { ItemProfile } from "../plots/itemProfile";

export class ItemGradu {
	private id: number[];
	private alternatives: number;
	private correctedMatrix: number[][];
	private mean: number[] = undefined!;
	private variance: number[] = undefined!;
	private discrimination: number[] = undefined!;
	private correctDiscrimination: number[] = undefined!;
	private usersDirectScore: number[] = undefined!;
	private questVariance: number = undefined!;
	private difficulty: number[] = undefined!;
	private numUsers: number;
	private numItems: number;

	private alternativeDifficulty: Map<string, number[]> = undefined!;


	constructor(
		correctMatrix: number[][],
		numberOfAnswer: number[],
	) {
		this.id = Array.from({ length: correctMatrix[0].length }, (_, i) => i);
		this.correctedMatrix = correctMatrix;
		this.alternatives = numberOfAnswer[0];
		this.numUsers = correctMatrix.length;
		this.numItems = correctMatrix[0].length;
	}

	public update(
		correctedMatrix: number[][],
	): void {
		this.id = Array.from({ length: correctedMatrix[0].length }, (_, i) => i);
		this.correctedMatrix = correctedMatrix;
		this.numUsers = correctedMatrix.length;
		this.numItems = correctedMatrix[0].length;
	}

	public calculate(
		usersDirectScore: number[],
		questVariance: number,
	): void {
		this.usersDirectScore = usersDirectScore;
		this.questVariance = questVariance;
		this.calculateMean();
		this.calculateStandartDeviation();  // TODO: FIX
		this.calculateDiscriminationValue();
		this.calculateCorrectDiscrimination();
		this.calculateAlternativeDifficulty();
		this.calculateDifficulty();

		this.correctedMatrix = undefined!;
	}

	private calculateDifficulty(): void { // TODO: Check this
		this.difficulty = Array.from({ length: this.numItems }, (_, colIndex) =>
			this.correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0) / this.numUsers
		);
	}


	private calculateMean(): void {
		this.mean = Array.from({ length: this.numItems }, (_, colIndex) =>
			this.correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0) / this.numUsers
		);
	}

	private calculateStandartDeviation(): void {

		this.variance = Array.from({ length: this.numItems }, (_, colIndex) =>
			this.correctedMatrix.reduce((acc, row) => acc + (row[colIndex] - this.mean[colIndex]) ** 2, 0) / (this.numUsers - 1)
		);
	}

	private calculateDiscriminationValue(): void {
		this.discrimination = Array.from({ length: this.numItems }, (_, i) => {
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


	private calculateCorrectDiscrimination(): void {

		this.correctDiscrimination = this.discrimination.map((value, index) => {
			const numerator = value * this.questVariance - this.variance[index];
			const denominator = Math.sqrt(this.questVariance ** 2 + this.variance[index] ** 2 - 2 * value * this.questVariance * this.variance[index]);
			return numerator / denominator;
		});
	}


	private calculateAlternativeDifficulty(): void {

		this.alternativeDifficulty = new Map<string, number[]>();

		const processAlternative = (alternative: number) => {
			const difficulty = Array.from({ length: this.numItems }, (_, colIndex) =>
				this.correctedMatrix.reduce((acc, row) => acc + (row[colIndex] === alternative ? 1 : 0), 0) / this.numUsers

			);

			this.alternativeDifficulty.set(`Difficulty ${alternative}`, difficulty);
		};

		for (let i = 0; i <= this.alternatives; i++) {
			processAlternative(i);
		}
	}



	public get idValue(): number[] { return this.id }

	public get discriminationValue(): number[] { return this.discrimination }

	public get correctDiscriminationValue(): number[] { return this.correctDiscrimination }

	public get alternativeDifficultyValue(): Map<string, number[]> { return this.alternativeDifficulty }

	public get standartDeviationValue(): number[] { return this.variance }

	public get difficultyValue(): number[] { return this.difficulty }

	public calculateFrequency(id: number): ItemFrequency {
		const alternativeDifficulty: Map<string, number> = new Map(
			Array.from(this.alternativeDifficulty.entries()).map(([key, value]) => [
				key.split(" ")[1],
				value[id] * this.numUsers
			])
		);
		return new ItemFrequency(alternativeDifficulty);
	}

	public calculateProfile(row: string[]): ItemProfile {
		return new ItemProfile(row, this.usersDirectScore);
	}
}

