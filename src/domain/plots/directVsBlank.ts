export class DirectVsBlank {
	private directScore: number[];
	private blankScore: number[];
	private id: number[];

	constructor(
		id: number[],
		directScore: number[],
		blankScore: number[]
	) {
		this.id = id;
		this.directScore = directScore;
		this.blankScore = blankScore.map(score => 100*score);
	}

	public getX() {
		return this.directScore;
	}

	public getY() {
		return this.blankScore;
	}

	public getHoverInfo() {
		return this.id;
	}
}
