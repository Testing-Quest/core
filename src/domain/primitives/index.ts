import type { BinaryCalcsType, GraduCalcsType, MultiCalcsType } from './calcs/calcs'
import type { QuestType, NewQuestType } from './quest'

type BinaryQuestType = QuestType & {
  type: 'binary'
  calcs: BinaryCalcsType
}

type MultiQuestType = QuestType & {
  type: 'multi'
  calcs: MultiCalcsType
}

type GraduQuestType = QuestType & {
  type: 'gradu'
  calcs: GraduCalcsType
}

type QuestTypes = BinaryQuestType | MultiQuestType | GraduQuestType

type QuestTypesMap = {
  binary: BinaryQuestType
  multi: MultiQuestType
  gradu: GraduQuestType
}
export const alternatives: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
]
export type { QuestTypes, QuestTypesMap, NewQuestType, BinaryQuestType, MultiQuestType, GraduQuestType }
