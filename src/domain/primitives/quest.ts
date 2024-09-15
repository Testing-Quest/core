export type NewQuestType = {
  uuid: string
  keys: string[]
  scale: number
  alternatives: number
  type: 'binary' | 'multi' | 'gradu'
  matrix: string[][] | number[][]
}

export type QuestType = {
  uuid: string
  keys: string[]
  scale: number
  alternatives: number
  originalKeys: string[]
}
