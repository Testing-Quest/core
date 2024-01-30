export class ItemDiscrimination{
	private discrimination: Map<string, number> = undefined!;
	constructor(
		discrimination: Map<string, number>,
	)
	{
		this.discrimination = discrimination;
	}

	public plot(): void {
		const data = Array.from(this.discrimination).map(([key, value]) => ({ key, value }));
		console.log(data);
	}
}
