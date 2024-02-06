export class UserMulti {
	private omisions: string[] = ['X', '*', ''];
	private id: number[] = undefined!;
	private mean: number[] = undefined!;
	private directScore: number[] = undefined!;
	private coherence: number[] = undefined!;
	private blankAnswers: number[] = undefined!;
	private mci: number[] = undefined!;

	private matrix: string[][] = undefined!;
	private correctedMatrix: number[][] = undefined!;


	constructor(
		matrix: string[][],
		correctedMatrix: number[][],
	) {
		this.id = Array.from({ length: matrix.length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
		this.calculate();
	}


	public update(
		matrix: string[][],
		correctedMatrix: number[][],
	): void {
		this.id = Array.from({ length: matrix.length }, (_, i) => i);
		this.matrix = matrix;
		this.correctedMatrix = correctedMatrix;
	}

	public calculate(): void {
		this.calculateDirectScore();
		this.calculateMean();
		this.calculateCoherence();  //TODO: BAD
		this.calculateBlankAnswers();
		this.calculateMCI();  //TODO: BAD
	}

	private calculateDirectScore(): void {
		this.directScore = this.correctedMatrix.map(row => {
			return row.reduce((prev, curr) => prev + curr, 0);
		});
	}

	private calculateBlankAnswers(): void {
		this.blankAnswers = this.matrix.map(row => {
			const blankAnswers = row.filter(answer => this.omisions.includes(answer)).length;
			if (blankAnswers === 0) return 0;
			return blankAnswers / row.length;
		});
	}

	private calculateCoherence(): void {
		/*
		 def directa_coherencia(datos: pd.DataFrame):
			"""
			los datos vienen en formato: Columnas = items, filas = sujetos
			"""

			#Leer los datos
			datos_df = datos.transpose()
			#trabajo funcion:
			Promedio = (datos.sum(axis=0))/datos.shape[1]
			coherencia = pd.DataFrame([datos_df[i].corr(Promedio) for i in range(0,datos_df.shape[1])]).sum(axis=1)
			return coherencia

		*/
		/*
		const transposedMatrix = this.correctedMatrix[0].map((_, colIndex) => this.correctedMatrix.map(row => row[colIndex]));

		this.coherence = transposedMatrix.map((item) => {
			const correlation = this.calculatePearson(item, this.mean);
			return correlation;
		});
		*/
		const numSujetos = this.correctedMatrix.length;
		const numItems = this.correctedMatrix[0].length;

		const mean = this.correctedMatrix.reduce((acc, row) => {
			return row.map((val, index) => acc[index] + val);
		}, new Array(numItems).fill(0)).map(val => val / numSujetos);

		this.coherence = this.correctedMatrix.map(row => {
			const numerator = row.reduce((acc, val, index) => acc + val * mean[index], 0);
			const denominator = Math.sqrt(
				row.reduce((acc, val) => acc + val ** 2, 0) * mean.reduce((acc, val) => acc + val ** 2, 0)
			);
			return numerator / denominator;
		});
	}
	
	/*
	private calculatePearson(arr1: number[], arr2: number[]): number { // TODO: Check if this is correct
		const n = arr1.length;
		const sumItem = arr1.reduce((prev, curr) => prev + curr, 0);
		const sumTotalScore = arr2.reduce((prev, curr) => prev + curr, 0);
		const sumItemTotalScore = arr1.reduce((prev, curr, index) => prev + curr * arr2[index], 0);
		const sumItemSquared = arr1.reduce((prev, curr) => prev + curr ** 2, 0);
		const sumTotalScoreSquared = arr2.reduce((prev, curr) => prev + curr ** 2, 0);

		const numerator = n * sumItemTotalScore - sumItem * sumTotalScore;
		const denominator = Math.sqrt(
			(n * sumItemSquared - sumItem ** 2) * (n * sumTotalScoreSquared - sumTotalScore ** 2)
		);

		return numerator / denominator;
	}
	*/

	private calculateMCI(): void {
		const numSujetos = this.correctedMatrix.length;
		const numItems = this.correctedMatrix[0].length;

		const proporcionesItems = new Array(numItems).fill(0);

		for (let j = 0; j < numItems; j++) {
			const respuestasCorrectas = this.correctedMatrix.map((sujeto) => sujeto[j]).reduce((acc, val) => acc + val, 0);
			proporcionesItems[j] = respuestasCorrectas / numSujetos;
		}

		this.mci = this.correctedMatrix.map((respuestasSujeto) => {
			const matrizX = respuestasSujeto.map((respuesta) => (respuesta >= 1 ? 1 : 0));
			const matrizXPrima = matrizX.slice().reverse();

			const covXPrimaP = this.covarianza(matrizXPrima, proporcionesItems);
			const covXP = this.covarianza(matrizX, proporcionesItems);
			const covXPrimaPPrima = this.covarianza(matrizXPrima, proporcionesItems.slice().reverse());

			if (covXPrimaPPrima === 0) {
				return 0;
			}

			return (covXPrimaP - covXP) / (covXPrimaP - covXPrimaPPrima);
		});
	}

	private covarianza(arr1: number[], arr2: number[]): number {
		const n = arr1.length;

		const media1 = arr1.reduce((acc, val) => acc + val, 0) / n;
		const media2 = arr2.reduce((acc, val) => acc + val, 0) / n;

		const covar = arr1.reduce((acc, val, index) => acc + (val - media1) * (arr2[index] - media2), 0) / n;

		return covar;
	}


	private calculateMean(): void {
		this.mean = this.directScore.map(score => score / this.correctedMatrix.length);
	}

	public get idValue(): number[] {
		return this.id;
	}

	public get coherenceValue(): number[] {
		return this.coherence;
	}

	public get totalScoreValue(): number[] {
		return this.directScore;
	}

	public get blankAnswersValue(): number[] {
		return this.blankAnswers;
	}

	public get meanValue(): number[] {
		return this.mean;
	}

	public get directScoreValue(): number[] {
		return this.directScore;
	}

	public get mciValue(): number[] {
		return this.mci;
	}
}
