import { QuestTypes } from "../primitives";
import { NewQuestType } from "../primitives/quest";
import { calcFactory } from "./strategies/calcStrategy/calcFactory";
import { CalcStrategy } from "./strategies/calcStrategy/CalcStrategy";
import { plotFactory } from "./strategies/plotStrategy/plotFactory";
import { PlotStrategy } from "./strategies/plotStrategy/PlotStrategy";
import { tableFactory } from "./strategies/tableStrategy/tableFactory";
import { Table, TableStrategy } from "./strategies/tableStrategy/TableStrategy";

export type dataPoint = { x: number; y: number };

export type UpdatePayload = {
  activeUsers: boolean[] | null;
  activeItems: boolean[] | null;
  keys: string[] | null;
};

export interface BaseQuest {
  getUuid(): string;
  getHealth(): { [name: string]: number };
  getReliability(): dataPoint[];
  getItemsMap(): dataPoint[];
  getDirectWeight(): dataPoint[];
  getDirectBlank(): dataPoint[];
  getDirectCohrency(): dataPoint[];
  getDirectMci(): dataPoint[];
  getScoreDistribution(): dataPoint[];
  getItemsTable(): Table;
  getUsersTable(): Table;
  getItemFrequency(id: number): dataPoint[];
  getItemDiscrimination(id: number): dataPoint[] | null;
  getItemProfile(id: number): { [profile: string]: dataPoint[] };
  update(payload: UpdatePayload): void;
  getModifications(): { keys: string[]; originalKeys: string[]; users: boolean[]; items: boolean[] };
}

export class Quest<Q extends QuestTypes> implements BaseQuest {

  constructor(
    private _props: Q,
    private _clsStrategy: CalcStrategy<Q>,
    private _pltStrategy: PlotStrategy<Q>,
    private _tblStrategy: TableStrategy<Q>,
  ) { }

  public getUuid(): string { return this._props.uuid }
  public getHealth(): { [name: string]: number } { return this._props.calculations.health }
  public getReliability(): dataPoint[] { return this._pltStrategy.getReliability(this._props) }
  public getItemsMap(): dataPoint[] { return this._pltStrategy.getItemsMap(this._props) }
  public getDirectWeight(): dataPoint[] { return this._pltStrategy.getDirectWeight(this._props) }
  public getDirectBlank(): dataPoint[] { return this._pltStrategy.getDirectBlank(this._props); }
  public getDirectCohrency(): dataPoint[] { return this._pltStrategy.getDirectCohrency(this._props) }
  public getDirectMci(): dataPoint[] { return this._pltStrategy.getDirectMci(this._props) }
  public getScoreDistribution(): dataPoint[] { return this._pltStrategy.getScoreDistribution(this._props) }
  public getItemsTable(): Table { return this._tblStrategy.getItemsTable(this._props) }
  public getUsersTable(): Table { return this._tblStrategy.getUsersTable(this._props) }
  public getItemFrequency(id: number): dataPoint[] { return this._pltStrategy.getItemFrequency(this._props, id) }
  public getItemDiscrimination(id: number): dataPoint[] | null { return this._pltStrategy.getItemDiscrimination(this._props, id) }
  public getItemProfile(id: number): { [profile: string]: dataPoint[] } { return this._pltStrategy.getItemProfile(this._props, id) }
  public update(payload: UpdatePayload): void {
    if (payload.activeItems) {
      this._props.itemsEnabled = payload.activeItems;
    }
    if (payload.activeUsers) {
      this._props.usersEnabled = payload.activeUsers;
    }
    if (payload.keys) {
      this._props.keys = payload.keys;
    }

    const keys = this._props.keys.filter((_, i) => this._props.itemsEnabled[i]);
    const matrix = this._clsStrategy.filterMatrix(this._props.matrix, this._props.itemsEnabled, this._props.usersEnabled);

    this._props = { ...this._props, calculations: this._clsStrategy.calculate(matrix, keys, this._props.alternatives) };
  }

  public getModifications(): { keys: string[]; originalKeys: string[]; users: boolean[]; items: boolean[] } {
  return { keys: this._props.keys, originalKeys: this._props.originalKeys, users: this._props.usersEnabled, items: this._props.itemsEnabled }
}

  public static create<Q extends QuestTypes>(props: NewQuestType): Quest < Q > {
  const cls = calcFactory<Q>(props.type);
  const plt = plotFactory<Q>(props.type);
  const tbl = tableFactory<Q>(props.type);

  return new Quest<Q>({
    ...props,
    itemsIds: Array.from({ length: props.matrix[0].length }, (_, i) => i),
    usersIds: Array.from({ length: props.matrix.length }, (_, i) => i),
    itemsEnabled: new Array(props.matrix[0].length).fill(true),
    usersEnabled: new Array(props.matrix.length).fill(true),
    originalKeys: props.keys,
    matrix: props.matrix,
    calculations: cls.calculate(props.matrix, props.keys, props.alternatives),
  } as Q, cls, plt, tbl);
}
}

