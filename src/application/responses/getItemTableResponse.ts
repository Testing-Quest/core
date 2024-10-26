import type { Table } from '../../domain/entities/strategies/tableStrategy/TableStrategy'
import type { Response } from './response'

export type GetItemTableResponse = Response & {
  data: Table | null
}
