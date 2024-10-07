import type { Response } from './response'

export type GetHealthResponse = Response & {
  data: Record<string, number> | null
}
