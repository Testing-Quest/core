import type { QuestTypesMap } from '../primitives'
import type { MatrixType, NewQuestType, QuestType } from '../primitives/quest'
import { calcFactory } from './strategies/calcStrategy/calcFactory'
import type { CalcStrategy } from './strategies/calcStrategy/CalcStrategy'
import { plotFactory } from './strategies/plotStrategy/plotFactory'
import type { PlotStrategy } from './strategies/plotStrategy/PlotStrategy'
import { tableFactory } from './strategies/tableStrategy/TableFactory'
import type { Table, TableStrategy } from './strategies/tableStrategy/TableStrategy'

export type DataPoint = { x: number; y: number; hover: number }
export type SimpleDataPoint = { x: number; y: number }
export type StringDataPoint = { x: string; y: number }

export type UpdatePayload = {
  activeUsers: boolean[] | null
  activeItems: boolean[] | null
  keys: string[] | null
}

export type BaseQuest = {
  getUuid(): string
  getHealth(): Record<string, number>
  getReliability(): SimpleDataPoint[]
  getItemsMap(): DataPoint[]
  getDirectWeight(): DataPoint[]
  getDirectBlank(): DataPoint[]
  getDirectCohrency(): DataPoint[]
  getDirectMci(): DataPoint[]
  getScoreDistribution(): SimpleDataPoint[]
  getItemsTable(): Table
  getUsersTable(): Table
  getItemFrequency(id: number): StringDataPoint[]
  getItemDiscrimination(id: number): StringDataPoint[]
  getItemProfile(id: number): Record<string, SimpleDataPoint[]>
  update(payload: UpdatePayload): void
  getNumAlternatives(): number
  getAlternativeFrequency(): Record<string, number>
  getModifications(): {
    keys: string[]
    originalKeys: string[]
    users: boolean[]
    items: boolean[]
  }
}

export class Quest<T extends keyof QuestTypesMap> implements BaseQuest {
  private _props: QuestTypesMap[T]
  private readonly _clsStrategy: CalcStrategy<T>
  private readonly _pltStrategy: PlotStrategy<T>
  private readonly _tblStrategy: TableStrategy<T>

  public constructor(attrs: {
    props: QuestTypesMap[T]
    clsStrategy: CalcStrategy<T>
    pltStrategy: PlotStrategy<T>
    tblStrategy: TableStrategy<T>
  }) {
    this._props = attrs.props
    this._clsStrategy = attrs.clsStrategy
    this._pltStrategy = attrs.pltStrategy
    this._tblStrategy = attrs.tblStrategy
  }

  public static create<T extends keyof QuestTypesMap>(attrs: NewQuestType & { type: T }): Quest<T> {
    const cls = calcFactory<T>(attrs.type)
    const plt = plotFactory<T>(attrs.type)
    const tbl = tableFactory<T>(attrs.type)

    const baseQuest: QuestType = {
      uuid: attrs.uuid,
      keys: attrs.keys,
      scale: attrs.scale,
      alternatives: attrs.alternatives,
      originalKeys: attrs.keys,
      matrix: attrs.matrix,
      itemsEnabled: attrs.matrix[0].map(() => true),
      itemsIds: attrs.matrix[0].map((_, i) => i),
      usersEnabled: attrs.matrix.map(() => true),
      usersIds: attrs.matrix.map((_, i) => i),
    }

    const questProps: QuestTypesMap[T] = {
      ...baseQuest,
      type: attrs.type,
      calcs: cls.calculate(attrs.matrix, attrs.keys, attrs.alternatives),
    } as QuestTypesMap[T]

    return new Quest<T>({ props: questProps, clsStrategy: cls, pltStrategy: plt, tblStrategy: tbl })
  }

  public getUuid(): string {
    return this._props.uuid
  }
  public getHealth(): Record<string, number> {
    return this._props.calcs.health
  }
  public getReliability(): SimpleDataPoint[] {
    return this._pltStrategy.getReliability(this._props.calcs)
  }
  public getItemsMap(): DataPoint[] {
    return this._pltStrategy.getItemsMap(this._props.calcs, this._props.itemsEnabled)
  }
  public getDirectWeight(): DataPoint[] {
    return this._pltStrategy.getDirectWeight(this._props.calcs, this._props.usersEnabled)
  }
  public getDirectBlank(): DataPoint[] {
    return this._pltStrategy.getDirectBlank(this._props.calcs, this._props.usersEnabled)
  }
  public getDirectCohrency(): DataPoint[] {
    return this._pltStrategy.getDirectCohrency(this._props.calcs, this._props.usersEnabled)
  }
  public getDirectMci(): DataPoint[] {
    return this._pltStrategy.getDirectMci(this._props.calcs, this._props.usersEnabled)
  }
  public getScoreDistribution(): SimpleDataPoint[] {
    return this._pltStrategy.getScoreDistribution(this._props.calcs)
  }
  public getItemFrequency(id: number): StringDataPoint[] {
    return this._pltStrategy.getItemFrequency(this._props.calcs, id)
  }
  public getItemDiscrimination(id: number): StringDataPoint[] {
    return this._pltStrategy.getItemDiscrimination(this._props.calcs, id)
  }
  public getNumAlternatives(): number {
    return this._props.alternatives
  }
  public getAlternativeFrequency(): Record<string, number> {
    return this._props.calcs.altFrequencies
  }
  public getItemsTable(): Table {
    return this._tblStrategy.getItemsTable(
      {
        itemsEnabled: this._props.itemsEnabled,
        itemsIds: this._props.itemsIds,
        keys: this._props.keys,
      },
      this._props.calcs.items,
    )
  }
  public getUsersTable(): Table {
    return this._tblStrategy.getUsersTable(
      {
        usersEnabled: this._props.usersEnabled,
        usersIds: this._props.usersIds,
      },
      this._props.calcs.users,
    )
  }
  public getItemProfile(id: number): Record<string, SimpleDataPoint[]> {
    return this._pltStrategy.getItemProfile(
      {
        matrix: this.filterMatrix(),
        alternatives: this._props.alternatives,
        calcs: this._props.calcs,
      },
      id,
    )
  }
  public update(payload: UpdatePayload): void {
    if (payload.activeItems) {
      this._props.itemsEnabled = payload.activeItems
    }
    if (payload.activeUsers) {
      this._props.usersEnabled = payload.activeUsers
    }
    if (payload.keys) {
      this._props.keys = payload.keys
    }
    const keys = this._props.keys.filter((_, i) => this._props.itemsEnabled[i])
    const matrix = this.filterMatrix()
    this._props = {
      ...this._props,
      calcs: this._clsStrategy.calculate(matrix, keys, this._props.alternatives),
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
      users: this._props.usersEnabled,
      items: this._props.itemsEnabled,
    }
  }
  private filterMatrix(): MatrixType {
    return this._clsStrategy.filterMatrix(this._props.matrix, this._props.itemsEnabled, this._props.usersEnabled)
  }
}
