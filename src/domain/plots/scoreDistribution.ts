export class ScoreDistribution {
	private directScore: number[];

	constructor(
		directScore: number[]
	) {
		this.directScore = directScore;
	}

	public getX() {
		return this.directScore;
	}
}
