export class MCQ {
	cronbachAlpha: number = NaN;
	sem: number = NaN;
	mean: number = NaN;
	variance: number = NaN;
	standardDeviation: number = NaN;

	reliability: number = NaN;
	discrimination: number = NaN;
	keyConflict: number = NaN;
	choice: number = NaN;
	coherency: number = NaN;

	difficulty: number = NaN;
	testHealth: number = NaN;

	// Matriz de respuestas de los usuarios
	private matrixResponses: any;

	// array con las respuestas correctas (1xNumero de Items)
	private correctAnswers: any;

	// array con las respuestas de la escala (1xNumero de Items)
	private escaleAnswers: any;

	// array con el numero de respuestas por item (1xNumero de Items)
	private numberOfAnswers: any;

	// array con el id del autor que ha hecho la pregunta (1xNumero de Items)
	private authorAnswers: any;

	// array con los atributos de los usuarios (MxNumero de Usuarios)
	private userAtributes: any;

	// Array de objetos Item
	private itemList: any;
	// Array booleano con los items activos
	private activeItems: any;

	// Array de objetos Usuario
	private userList: any;
	// Array booleano con los usuarios activos
	private activeUsers: any;


	constructor(
		matrix: any = NaN,
		correctAnswers: any = NaN,
		escaleAnswers: any = NaN,
		numberOfAnswers: any = NaN,
		authorAnswers: any = NaN,
		userList: any = NaN,
		userAtributes: any = NaN
	) {

		this.matrixResponses = matrix;
		this.correctAnswers = correctAnswers;
		this.escaleAnswers = escaleAnswers;
		this.numberOfAnswers = numberOfAnswers;
		this.authorAnswers = authorAnswers;
		this.userList = userList;
		this.userAtributes = userAtributes;

		this.generateItemsList();
		this.calculateHealth();
	}

	private generateItemsList(): void {
		this.itemList = [];
	}

	private calculateHealth(): void {
		this.cronbachAlpha = 0;
		this.sem = 0;
		this.mean = 0;
		this.variance = 0;
		this.standardDeviation = 0;

		this.reliability = 0;
		this.discrimination = 0;
		this.keyConflict = 0;
		this.choice = 0;
		this.coherency = 0;

		this.difficulty = 0;
		this.testHealth = 0;
	}

	public calculateReliability(): number {
		return this.reliability;
	}

	public getItemsMap(): Map<string, any> {
		return new Map<string, any>();
	}

	public directVsWeighted(): void {
	}

	public directVsBlankAnswer(): void {
	}

	public directVsCoherency(): void {
	}

	public directVsMCI(): void {
	}

	public scoreDistribution(): void {
	}

	public getItemsTable(): any {
		return {};
	}

	public getExamineesTable(): any {
		return {};
	}

	public deactiveItems(): void {
	}

	public activateItems(): void {
	}

	public deactiveExaminees(): void {
	}

	public activateExaminees(): void {
	}
}
