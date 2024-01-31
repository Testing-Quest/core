export class HealthProblemsGradu {
	private choice: number;
	private discriminative: number;
	private relaiability: number;
	private coherency: number;
	private keyConflict: number;


	constructor(
		choice: number,
		discriminative: number,
		relaiability: number,
		coherency: number,
		keyConflict: number
	) {
		this.choice = choice;
		this.discriminative = discriminative;
		this.relaiability = relaiability;
		this.coherency = coherency;
		this.keyConflict = keyConflict;
	}

	public plot(): void {
		console.log(this.choice);
		console.log(this.discriminative);
		console.log(this.relaiability);
		console.log(this.coherency);
		console.log(this.keyConflict);
	}

}
