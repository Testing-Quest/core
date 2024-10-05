import type { Response } from './response'

export type GetReliabilityResponse = Response & {
  reliability: { x: number; y: number }[] | null
}
