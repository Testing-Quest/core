import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetDirectBlankResponse = Response & {
  data: DataPoint[] | null
}
