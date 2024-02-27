export class DirectVsMCI {
	private directScore: number[];
	private mciScore: number[];

	constructor(
		directScore: number[],
		mciScore: number[]
	) {
		this.directScore = directScore;
		this.mciScore = mciScore;
	}
	public plot(): void {
		console.log(this.directScore);
		console.log(this.mciScore);
	}
}
