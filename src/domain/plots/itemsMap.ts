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

	public getX(){
		return this.discrimination;
	}

	public getY(){
		return this.difficulty;
	}

	public getHoverInfo(){
		return this.id;
	}
}
