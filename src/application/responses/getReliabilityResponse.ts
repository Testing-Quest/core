import type { SimpleDataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetReliabilityResponse = Response & {
  reliability: SimpleDataPoint[] | null
}
