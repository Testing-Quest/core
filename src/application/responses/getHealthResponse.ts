import type { Response } from './response'

export type GetHealthResponse = Response & {
  health: Record<string, number> | null
}
