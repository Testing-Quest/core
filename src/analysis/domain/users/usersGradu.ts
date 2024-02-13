export class UserGradu {
	private id: number[] = undefined!;
	private mean: number[] = undefined!;
	private directScore: number[] = undefined!;
	private blankAnswers: number[] = undefined!;

	private correctedMatrix: number[][] = undefined!;


	constructor(
		correctedMatrix: number[][],
	) {
		this.id = Array.from({ length: correctedMatrix.length }, (_, i) => i);
		this.correctedMatrix = correctedMatrix;
	}


	public update(
		correctedMatrix: number[][],
	): void {
		this.id = Array.from({ length: correctedMatrix.length }, (_, i) => i);
		this.correctedMatrix = correctedMatrix;
	}

	public calculate(): void {
		this.calculateDirectScore();
		this.calculateMean();
		this.calculateBlankAnswers();

		this.correctedMatrix = undefined!;
	}

	private calculateDirectScore(): void {
		this.directScore = this.correctedMatrix.map(row => {
			return row.reduce((prev, curr) => prev + curr, 0);
		});
	}

	private calculateBlankAnswers(): void {
		this.blankAnswers = this.correctedMatrix.map(row => {
			const blankAnswers = row.filter(answer => answer === 0).length;
			if (blankAnswers === 0) return 0;
			return blankAnswers / row.length;
		});
	}


	private calculateMean(): void {
		this.mean = this.directScore.map(score => score / this.correctedMatrix[0].length);
	}

	public get idValue(): number[] {
		return this.id;
	}

	public get totalScoreValue(): number[] {
		return this.directScore;
	}

	public get blankAnswersValue(): number[] {
		return this.blankAnswers;
	}

	public get meanValue(): number[] {
		return this.mean;
	}

	public get directScoreValue(): number[] {
		return this.directScore;
	}
}

