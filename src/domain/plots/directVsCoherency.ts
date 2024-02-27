export class DirectVsCoherency {

	private directScore: number[];
	private coherencyScore: number[];

	constructor(
		directScore: number[],
		coherencyScore: number[]
	) {
		this.directScore = directScore;
		this.coherencyScore = coherencyScore;
	}
	public plot(): void {
		console.log(this.directScore);
		console.log(this.coherencyScore);
	}
}
