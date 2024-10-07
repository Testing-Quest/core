import type { StringDataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetItemDiscriminationResponse = Response & {
  data: StringDataPoint[] | null
}
