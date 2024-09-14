import { QuestTypes } from "../../../primitives";

export interface CalcStrategy<Q extends QuestTypes> {
  calculate(matrix: Q['matrix'], keys: string[], alternatives: number): Q['calculations'];
  filterMatrix(matrx: Q['matrix'], activeItems: boolean[], activeUsers: boolean[]): Q['matrix']
}
