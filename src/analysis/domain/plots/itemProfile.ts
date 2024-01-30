export class ItemProfile {
	private item: string[] = undefined!;
	private directScore: number[] = undefined!;
	private groupsProfile: Map<number, Map<string, number>> = undefined!;
	constructor(
		item: string[],
		directScore: number[],
	) {
		this.item = item;
		this.directScore = directScore;
		this.calculateGroupsProfile();
	}


	private calculateGroupsProfile(): void {
		const itemsDirectScore: [string, number][] = this.item.map((item, index) => [item, this.directScore[index]]);

		const maxScore = Math.max(...this.directScore);
		const groupSize = maxScore / 5;

		this.groupsProfile = new Map<number, Map<string, number>>(
			Array.from({ length: 5 }, (_, i) => [i + 1, new Map<string, number>()])
		);

		const groupsCutoffs = new Map<number, number>(
			Array.from({ length: 5 }, (_, i) => [i + 1, groupSize * (i + 1)])
		);

		for (const [item, directScore] of itemsDirectScore) {
			for (let i = 1; i <= 5; i++) {
				if (directScore <= groupsCutoffs.get(i)!) {
					const group = this.groupsProfile.get(i)!;
					group.set(item, (group.get(item) || 0) + 1);
					break;
				}
			}
		}
	}


	public plot(): void {
	}
}
