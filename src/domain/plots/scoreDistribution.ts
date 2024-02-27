export class ScoreDistribution {
	private directScore: number[];

	constructor(
		directScore: number[]
	) {
		this.directScore = directScore;
	}

	public plot(): void {
		console.log(this.directScore);
	}
}
