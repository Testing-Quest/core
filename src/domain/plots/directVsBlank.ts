export class DirectVsBlank {
	private directScore: number[];
	private blankScore: number[];

	constructor(
		directScore: number[],
		blankScore: number[]
	) {
		this.directScore = directScore;
		this.blankScore = blankScore;
	}
	public plot(): void {
		console.log(this.directScore);
		console.log(this.blankScore);
	}
}
