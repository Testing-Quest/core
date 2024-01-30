export class ItemFrequency{
	private frequencies: Map<string, number> = undefined!;
	constructor(
		frequencies: Map<string, number>,
	)
	{
		this.frequencies = frequencies;
	}

	public plot(): void {
		const data = Array.from(this.frequencies).map(([key, value]) => ({ key, value }));
		console.log(data);
	}
}
