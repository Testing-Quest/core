export class DirectVsWeighted {
	private directScore: number[] = undefined!;
	private weightedScore: number[] = undefined!;

	constructor(
		directScore: number[],
		weightedScore: number[],
	) {
		this.directScore = directScore;
		this.weightedScore = weightedScore;
	}

	public plot(): void {
		console.log(this.directScore)
		console.log(this.weightedScore)
	}
}
