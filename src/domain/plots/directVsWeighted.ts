export class DirectVsWeighted {
	private directScore: number[] = undefined!;
	private weightedScore: number[] = undefined!;
	private id: number[] = undefined!;

	constructor(
		id: number[],
		directScore: number[],
		weightedScore: number[],
	) {
		this.id = id;
		this.directScore = directScore;
		this.weightedScore = weightedScore;
	}
	public getX() {
		return this.directScore;
	}
	public getY() {
		return this.weightedScore;
	}
	public getHoverInfo() {
		return this.id;
	}
}
