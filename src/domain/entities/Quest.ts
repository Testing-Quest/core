import type { QuestTypesMap } from '../primitives'
import type { NewQuestType } from '../primitives/quest'
import { calcFactory } from './strategies/calcStrategy/calcFactory'
import type { CalcStrategy } from './strategies/calcStrategy/CalcStrategy'
import { plotFactory } from './strategies/plotStrategy/plotFactory'
import type { PlotStrategy } from './strategies/plotStrategy/PlotStrategy'
import { tableFactory } from './strategies/tableStrategy/tableFactory'
import type {
  Table,
  TableStrategy,
} from './strategies/tableStrategy/TableStrategy'

export type dataPoint = { x: number; y: number }

export type UpdatePayload = {
  activeUsers: boolean[] | null
  activeItems: boolean[] | null
  keys: string[] | null
}

export type BaseQuest = {
  getUuid(): string
  getHealth(): Record<string, number>
  getReliability(): dataPoint[]
  getItemsMap(): dataPoint[]
  getDirectWeight(): dataPoint[]
  getDirectBlank(): dataPoint[]
  getDirectCohrency(): dataPoint[]
  getDirectMci(): dataPoint[]
  getScoreDistribution(): dataPoint[]
  getItemsTable(): Table
  getUsersTable(): Table
  getItemFrequency(id: number): dataPoint[]
  getItemDiscrimination(id: number): dataPoint[] | null
  getItemProfile(id: number): Record<string, dataPoint[]>
  update(payload: UpdatePayload): void
  getModifications(): {
    keys: string[]
    originalKeys: string[]
    users: boolean[]
    items: boolean[]
  }
}

export class Quest<T extends keyof QuestTypesMap> implements BaseQuest {
  constructor(
    private _props: QuestTypesMap[T],
    private readonly _clsStrategy: CalcStrategy<T>,
    private readonly _pltStrategy: PlotStrategy<T>,
    private readonly _tblStrategy: TableStrategy<T>,
  ) {}

  public getUuid(): string {
    return this._props.uuid
  }
  public getHealth(): Record<string, number> {
    return this._props.calcs.health
  }
  public getReliability(): dataPoint[] {
    return this._pltStrategy.getReliability(this._props.calcs)
  }
  public getItemsMap(): dataPoint[] {
    return this._pltStrategy.getItemsMap(this._props.calcs)
  }
  public getDirectWeight(): dataPoint[] {
    return this._pltStrategy.getDirectWeight(this._props.calcs)
  }
  public getDirectBlank(): dataPoint[] {
    return this._pltStrategy.getDirectBlank(this._props.calcs)
  }
  public getDirectCohrency(): dataPoint[] {
    return this._pltStrategy.getDirectCohrency(this._props.calcs)
  }
  public getDirectMci(): dataPoint[] {
    return this._pltStrategy.getDirectMci(this._props.calcs)
  }
  public getScoreDistribution(): dataPoint[] {
    return this._pltStrategy.getScoreDistribution(this._props.calcs)
  }
  public getItemsTable(): Table {
    return this._tblStrategy.getItemsTable(
      this._props.calcs.items,
      this._props.keys,
    )
  }
  public getUsersTable(): Table {
    return this._tblStrategy.getUsersTable(this._props.calcs.users)
  }
  public getItemFrequency(id: number): dataPoint[] {
    return this._pltStrategy.getItemFrequency(this._props.calcs, id)
  }
  public getItemDiscrimination(id: number): dataPoint[] | null {
    return this._pltStrategy.getItemDiscrimination(this._props.calcs, id)
  }
  public getItemProfile(id: number): Record<string, dataPoint[]> {
    return this._pltStrategy.getItemProfile(this._props.calcs, id)
  }
  public update(payload: UpdatePayload): void {
    if (payload.activeItems) {
      this._props.calcs.items.itemsEnabled = payload.activeItems
    }
    if (payload.activeUsers) {
      this._props.calcs.users.usersEnabled = payload.activeUsers
    }
    if (payload.keys) {
      this._props.keys = payload.keys
    }
    const keys = this._props.keys.filter(
      (_, i) => this._props.calcs.items.itemsEnabled[i],
    )
    const matrix = this._clsStrategy.filterMatrix(
      this._props.matrix,
      this._props.calcs.items.itemsEnabled,
      this._props.calcs.users.usersEnabled,
    )
    this._props = {
      ...this._props,
      calculations: this._clsStrategy.calculate(
        matrix,
        keys,
        this._props.alternatives,
      ),
    }
  }

  public getModifications(): {
    keys: string[]
    originalKeys: string[]
    users: boolean[]
    items: boolean[]
  } {
    return {
      keys: this._props.keys,
      originalKeys: this._props.originalKeys,
      users: this._props.calcs.users.usersEnabled,
      items: this._props.calcs.items.itemsEnabled,
    }
  }

  public static create<T extends keyof QuestTypesMap>(
    props: NewQuestType & { type: T },
  ): Quest<T> {
    const cls = calcFactory<T>(props.type)
    const plt = plotFactory<T>(props.type)
    const tbl = tableFactory<T>(props.type)

    const questProps: QuestTypesMap[T] = {
      uuid: props.uuid,
      keys: props.keys,
      scale: props.scale,
      matrix: props.matrix,
      type: props.type,
      originalKeys: props.keys,
      calcs: cls.calculate(props.matrix, props.keys, props.alternatives),
    } as QuestTypesMap[T]

    return new Quest<T>(questProps, cls, plt, tbl)
  }
}
