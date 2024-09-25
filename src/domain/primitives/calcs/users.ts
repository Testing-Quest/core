export type UsersType = {
  readonly directScore: number[]
  readonly mean: number[]
  readonly totalScore: number[]
  readonly blankAnswer: number[]
}

export type BinaryUsersType = UsersType & {
  readonly weightedScore: number[]
  readonly coherence: number[]
  readonly mci: number[]
}

export type MultiUsersType = UsersType & {
  readonly weightedScore: number[]
  readonly coherence: number[]
  readonly mci: number[]
}

export type GraduUsersType = UsersType
