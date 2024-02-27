export class ItemMap{

	private id: number[];
	private difficulty: number[];
	private discrimination: number[];

	constructor(
		id: number[],
		difficulty: number[],
		discrimination: number[],
	){
		this.id = id;
		this.difficulty = difficulty;
		this.discrimination = discrimination;
	}

	public plot(): void {
		console.log(this.id)
		console.log(this.difficulty)
		console.log(this.discrimination)
	}
}
