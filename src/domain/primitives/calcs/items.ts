export type ItemsType = {
  itemsIds: number[]
  itemsEnabled: boolean[]
  variance: number[]
  discrimination: number[]
  corrDiscrimination: number[]
  difficulty: number[]
  altDifficulty: Record<string, number[]>

  conflict?: boolean[]
  choice?: boolean[]
  altDiscrimination?: Record<string, number[]>
}

export type BinaryItemsType = ItemsType & {
  conflict: boolean[]
  altDiscrimination: Record<string, number[]>
}

export type MultiItemsType = ItemsType & {
  conflict: boolean[]
  choice: boolean[]
  altDiscrimination: Record<string, number[]>
}

export type GraduItemsType = ItemsType
