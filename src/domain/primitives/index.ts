import type { BinaryCalcsType, GraduCalcsType, MultiCalcsType } from './calcs/calcs'
import type { QuestType, NewQuestType } from './quest'

type BinaryQuestType = QuestType & {
  readonly type: 'binary'
  calcs: BinaryCalcsType
}

type MultiQuestType = QuestType & {
  readonly type: 'multi'
  calcs: MultiCalcsType
}

type GraduQuestType = QuestType & {
  readonly type: 'gradu'
  calcs: GraduCalcsType
}

type QuestTypes = BinaryQuestType | MultiQuestType | GraduQuestType

type QuestTypesMap = {
  readonly binary: BinaryQuestType
  readonly multi: MultiQuestType
  readonly gradu: GraduQuestType
}
export const allAlternatives: string[] = [
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
