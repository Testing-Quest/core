export class DirectVsMCI {
	private directScore: number[];
	private mciScore: number[];
	private id: number[];

	constructor(
		id: number[],
		directScore: number[],
		mciScore: number[]
	) {
		this.id = id;
		this.directScore = directScore;
		this.mciScore = mciScore;
	}

	public getX() {
		return this.directScore;
	}

	public getY() {
		return this.mciScore;
	}

	public getHoverInfo() {
		return this.id;
	}
}

