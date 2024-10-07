export type MatrixType = (string | number | null)[][]

export type NewQuestType = {
  uuid: string
  keys: string[]
  scale: number
  alternatives: number
  type: 'binary' | 'multi' | 'gradu'
  matrix: MatrixType
}

export type QuestType = {
  uuid: string
  keys: string[]
  scale: number
  alternatives: number
  originalKeys: string[]
  matrix: MatrixType
  itemsEnabled: boolean[]
  readonly itemsIds: number[]
  usersEnabled: boolean[]
  readonly usersIds: number[]
}
