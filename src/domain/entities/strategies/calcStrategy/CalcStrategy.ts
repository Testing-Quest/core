import { QuestTypes } from "../../../primitives";
import { UpdatePayload } from "../../Quest";


export interface CalcStrategy<Q extends QuestTypes> {
  calculate(matrix: Q['matrix'], keys: string[], alternatives: number): Q['calculations'];
  filterMatrix(matrx: Q['matrix'], activeItems: boolean[], activeUsers: boolean[]): Q['matrix']
  update(payload: UpdatePayload, quest: Q): Q;
}

export abstract class CalcStrategyBase<Q extends QuestTypes> implements CalcStrategy<Q> {
  abstract calculate(matrix: Q['matrix'], keys: string[], alternatives: number): Q['calculations'];
  abstract filterMatrix(matrx: Q['matrix'], activeItems: boolean[], activeUsers: boolean[]): Q['matrix'];
  public update(payload: UpdatePayload, quest: Q): Q {
    if (payload.activeItems) {
      quest.itemsEnabled = payload.activeItems;
    }
    if (payload.activeUsers) {
      quest.usersEnabled = payload.activeUsers;
    }
    if (payload.keys) {
      quest.keys = payload.keys;
    }

    const keys = quest.keys.filter((_, i) => quest.itemsEnabled[i]);
    const matrix = this.filterMatrix(quest.matrix, quest.itemsEnabled, quest.usersEnabled);

    return { ...quest, calculations: this.calculate(matrix, keys, quest.alternatives) };
  }
}
