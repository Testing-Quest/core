import {
  BinaryItemsType,
  GraduItemsType,
  ItemsType,
  MultiItemsType,
} from './items'
import {
  BinaryUsersType,
  GraduUsersType,
  MultiUsersType,
  UsersType,
} from './users'

export type CalcsType = {
  correctedMatrix: number[][]
  health: HealthType
  items: ItemsType
  users: UsersType
}

type HealthType = {
  cronbachAlpha: number
  sem: number
  mean: number
  variance: number
  standardDeviation: number
  reliability: number
  discrimination: number
  testHealth: number

  coherency?: number
  choice?: number
  difficulty?: number
  keyConflict?: number
}

type BinaryHealthType = HealthType & {
  coherency: number
  difficulty: number
}

type MultiHealthType = HealthType & {
  coherency: number
  choice: number
  difficulty: number
  keyConflict: number
}

type GraduHealthType = HealthType

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
