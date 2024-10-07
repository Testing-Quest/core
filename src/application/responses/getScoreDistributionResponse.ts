import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetScoreDistributionResponse = Response & {
  data: DataPoint[] | null
}
