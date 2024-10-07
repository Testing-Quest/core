import type { Response } from './response'

export type GetModificatinosResponse = Response & {
  response: {
    keys: string[]
    originalKeys: string[]
    users: boolean[]
    items: boolean[]
  } | null
}
