import type { BinaryItemsType, GraduItemsType, ItemsType, MultiItemsType } from './items'
import type { BinaryUsersType, GraduUsersType, MultiUsersType, UsersType } from './users'

export type CalcsType = {
  readonly correctMatrix: number[][]
  readonly health: HealthType
  readonly items: ItemsType
  readonly users: UsersType
  readonly altFrequencies: Record<string, number>
}

type HealthType = {
  readonly cronbachAlpha: number
  readonly sem: number
  readonly mean: number
  readonly variance: number
  readonly standardDeviation: number
  readonly reliability: number
  readonly discrimination: number
  readonly testHealth: number
}

type BinaryHealthType = HealthType & {
  readonly coherency: number
  readonly difficulty: number
}

type MultiHealthType = HealthType & {
  readonly coherency: number
  readonly choice: number
  readonly difficulty: number
  readonly keyConflict: number
}

type GraduHealthType = HealthType & {
  readonly score: number
  readonly variability: number
}

export type BinaryCalcsType = CalcsType & {
  health: BinaryHealthType
  items: BinaryItemsType
  users: BinaryUsersType
}

export type MultiCalcsType = CalcsType & {
  health: MultiHealthType
  items: MultiItemsType
  users: MultiUsersType
}

export type GraduCalcsType = CalcsType & {
  health: GraduHealthType
  items: GraduItemsType
  users: GraduUsersType
}
