import { BinaryCalcsType, GraduCalcsType, MultiCalcsType } from './calcs/calcs'
import { QuestType, NewQuestType } from './quest'

type BinaryQuestType = QuestType & {
  type: 'binary'
  matrix: string[][]
  calcs: BinaryCalcsType
}

type MultiQuestType = QuestType & {
  type: 'multi'
  matrix: string[][]
  calcs: MultiCalcsType
}

type GraduQuestType = QuestType & {
  type: 'gradu'
  matrix: number[][]
  calcs: GraduCalcsType
}

type QuestTypes = BinaryQuestType | MultiQuestType | GraduQuestType

type QuestTypesMap = {
  "binary": BinaryQuestType
  "multi": MultiQuestType
  "gradu": GraduQuestType
}

export type {
  QuestTypes,
  QuestTypesMap,
  NewQuestType,
  BinaryQuestType,
  MultiQuestType,
  GraduQuestType,
}
