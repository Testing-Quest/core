import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetDirectMciResponse = Response & {
  data: DataPoint[] | null
}
