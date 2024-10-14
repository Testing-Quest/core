import type { SimpleDataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetScoreDistributionResponse = Response & {
  data: SimpleDataPoint[] | null
}
