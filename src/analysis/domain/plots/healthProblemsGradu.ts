export class HealthProblemsGradu {
	private variability: number;
	private discrimination: number;
	private reliability: number;


	constructor(
		variability: number,
		discrimination: number,
		reliability: number,
	) {
		this.variability = variability
		this.discrimination = discrimination
		this.reliability = reliability
	}

	public plot(): void {
		console.log(this.variability);
		console.log(this.discrimination);
		console.log(this.reliability);
	}

}
