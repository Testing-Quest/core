import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetItemMapResponse = Response & {
  data: DataPoint[] | null
}
