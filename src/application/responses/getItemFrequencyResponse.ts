import type { StringDataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetItemFrequencyResponse = Response & {
  data: StringDataPoint[] | null
}
