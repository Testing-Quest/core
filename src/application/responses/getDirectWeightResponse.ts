import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetDirectWeightResponse = Response & {
  data: DataPoint[] | null
}
