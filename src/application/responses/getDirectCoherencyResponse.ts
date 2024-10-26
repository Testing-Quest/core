import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetDirectCoherencyResponse = Response & {
  data: DataPoint[] | null
}
