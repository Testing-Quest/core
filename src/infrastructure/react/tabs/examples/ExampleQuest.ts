type Quest = {
  scale: number
  type: string
  users: number
  items: number
}

export type ExampleQuest = {
  name: string
  uuid: string
  path: string
  quests: Quest[]
}
