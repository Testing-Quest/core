export type UsersType = {
  usersIds: number[]
  usersEnabled: boolean[]
  directScore: number[]
  mean: number[]
  totalScore: number[]
  blankAnswer: number[]
  weightedScore?: number[]
  coherence?: number[]
  mci?: number[]
}

export type BinaryUsersType = UsersType & {
  weightedScore: number[]
  coherence: number[]
  mci: number[]
}

export type MultiUsersType = UsersType & {
  weightedScore: number[]
  coherence: number[]
  mci: number[]
}

export type GraduUsersType = UsersType
