import type { DataPoint } from '../../domain/entities/Quest'
import type { Response } from './response'

export type GetItemProfileResponse = Response & {
  data: Record<string, DataPoint[]> | null
}
