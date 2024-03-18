export class DirectVsCoherency {

	private directScore: number[];
	private coherencyScore: number[];
	private id: number[]


	constructor(
		id: number[],
		directScore: number[],
		coherencyScore: number[]
	) {
		this.id = id;
		this.directScore = directScore;
		this.coherencyScore = coherencyScore;
	}

	public getX() {
		return this.directScore;
	}

	public getY() {
		return this.coherencyScore;
	}

	public getHoverInfo() {
		return this.id;
	}
}
