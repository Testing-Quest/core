export class UserMulti {
	private omisions: string[] = ['X', '*', ''];
	private id: number[] = undefined!;
	private mean: number[] = undefined!;
	private directScore: number[] = undefined!;
	private coherence: number[] = undefined!;
	private blankAnswers: number[] = undefined!;

	private matrix: string[][] = undefined!;
	private correctedMatrix: number[][] = undefined!;


	constructor(
		matrix: string[][],
		correctedMatrix: number[][],
	) {
		this.id = Array.from({ length: matrix.length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
	}


	public update(
		matrix: string[][],
		correctedMatrix: number[][],
	): void {
		this.id = Array.from({ length: matrix.length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
	}

	public calculate(): void {
		this.calculateDirectScore();
		this.calculateMean();
		this.calculateCoherence(); 
		this.calculateBlankAnswers();

		this.matrix = undefined!;
		this.correctedMatrix = undefined!;
	}

	private calculateDirectScore(): void {
		this.directScore = this.correctedMatrix.map(row => {
			return row.reduce((prev, curr) => prev + curr, 0);
		});
	}

	private calculateBlankAnswers(): void {
		this.blankAnswers = this.matrix.map(row => {
			const blankAnswers = row.filter(answer => this.omisions.includes(answer)).length;
			if (blankAnswers === 0) return 0;
			return blankAnswers / row.length;
		});
	}

	private calculateCoherence(): void {
		const averagePunctuation: number[] = this.correctedMatrix[0].map((_, colIndex) => {
			return this.correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0) / this.correctedMatrix.length;
		});
		
		this.coherence = this.correctedMatrix.map((row) => { 
			return this.calculatePearson(row, averagePunctuation);
		});

	}
	
	private calculatePearson(arr1: number[], arr2: number[]): number { 
		const n = arr1.length;
		const sumItem = arr1.reduce((prev, curr) => prev + curr, 0);
		const sumTotalScore = arr2.reduce((prev, curr) => prev + curr, 0);
		const sumItemTotalScore = arr1.reduce((prev, curr, index) => prev + curr * arr2[index], 0);
		const sumItemSquared = arr1.reduce((prev, curr) => prev + curr ** 2, 0);
		const sumTotalScoreSquared = arr2.reduce((prev, curr) => prev + curr ** 2, 0);

		const numerator = n * sumItemTotalScore - sumItem * sumTotalScore;
		const denominator = Math.sqrt(
			(n * sumItemSquared - sumItem ** 2) * (n * sumTotalScoreSquared - sumTotalScore ** 2)
		);

		return numerator / denominator;
	}


	private calculateMean(): void {
		this.mean = this.directScore.map(score => score / this.correctedMatrix[0].length);
	}

	public get idValue(): number[] {
		return this.id;
	}

	public get coherenceValue(): number[] {
		return this.coherence;
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
