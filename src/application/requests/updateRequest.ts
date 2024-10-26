import type { Request } from './requests'

export type UpdateRequest = Request & {
  data: {
    activeUsers: boolean[] | null
    activeItems: boolean[] | null
    keys: string[] | null
  }
}
