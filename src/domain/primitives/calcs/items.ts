export type ItemsType = {
  readonly variance: number[]
  readonly discrimination: number[]
  readonly corrDiscrimination: number[]
  readonly difficulty: number[]
  readonly altDifficulty: Record<string, number[]>
}

export type BinaryItemsType = ItemsType & {
  readonly conflict: boolean[]
  readonly altDiscrimination: Record<string, number[]>
}

export type MultiItemsType = ItemsType & {
  readonly conflict: boolean[]
  readonly choice: boolean[]
  readonly altDiscrimination: Record<string, number[]>
}

export type GraduItemsType = ItemsType
