import type { DataPoint, StringDataPoint } from '../../src/domain/entities/Quest'
import type { Table } from '../../src/domain/entities/strategies/tableStrategy/TableStrategy'

export type Result = {
  health: Record<string, number>
  reliability: DataPoint[]
  itemsMap: DataPoint[]
  directWeight: DataPoint[]
  directBlank: DataPoint[]
  directCohrency: DataPoint[]
  directMci: DataPoint[]
  scoreDistribution: DataPoint[]
  itemsTable: Table
  usersTable: Table
  itemsFrequencies: Record<number, StringDataPoint[]>
  itemsDiscriminations: Record<number, StringDataPoint[]>
  itemsProfiles: Record<number, Record<string, DataPoint[]>>
}
