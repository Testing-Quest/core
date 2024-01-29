export class UserMulti{
	private omisions: string[] = ['X', '*', ''];
	private id: number[] = undefined!;
	private mean: number = undefined!;
	private directScore: number[] = undefined!;
	private weightScore: number[] = undefined!;
	private coherence: number[] = undefined!;
	private totalScore: number[] = undefined!;
	private blankAnswers: number[] = undefined!;
	private mci: number[] = undefined!;

	private matrix: string[][] = undefined!;
	private correctedMatrix: number[][] = undefined!;


	constructor(
		matrix: string[][],
		correctedMatrix: number[][],
	) {
		this.id = Array.from({ length: matrix[0].length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
		this.calculate();
	}


	public update(
		matrix: string[][],
		correctedMatrix: number[][],
	): void {
		this.id = Array.from({ length: matrix[0].length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
	}

	public calculate(): void {
		this.calculateDirectScore();
		this.calculateMean();
		this.calculateWeightScore();
		this.calculateCoherence();
		this.calculateTotalScore();
		this.calculateBlankAnswers();
		this.calculateMCI();
	}

	private calculateDirectScore(): void {
		this.directScore = this.correctedMatrix.map(row => {
			return row.reduce((prev, curr) => prev + curr, 0);
		});
	}

	private calculateMean(): void {
		this.mean = this.directScore.reduce((prev, curr) => prev + curr, 0) / this.directScore.length;
	}

	public get idValue(): number[] {
		return this.id;
	}

	public get weightedScoreValue(): number[] {
		return this.weightScore;
	}

	public get coherenceValue(): number[] { 
		return this.coherence;
	}

	public get totalScoreValue(): number[] {
		return this.totalScore;
	}

	public get blankAnswersValue(): number[] {
		return this.blankAnswers;
	}


	public get meanValue(): number {
		return this.mean;
	}

	public get directScoreValue(): number[] {
		return this.directScore;
	}

	public get mciValue(): number[] {
		return this.mci;
	}
}
