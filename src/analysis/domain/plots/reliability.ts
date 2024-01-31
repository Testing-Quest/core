export class Reliability {
	private alpha: number[]

	constructor(
		alpha: number[]
	){
		this.alpha = alpha
	}

	public plot(): void {
		console.log(this.alpha)
	}
}
