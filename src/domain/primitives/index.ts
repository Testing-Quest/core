import { BinaryQuestType } from "./binary/binaryQuest";
import { GraduQuestType } from "./gradu/graduQuest";
import { MultiQuestType } from "./multi/multiQuest";
import { QuestType } from "./quest";

type QuestTypes = BinaryQuestType | MultiQuestType | GraduQuestType;

type QuestTypeMap = {
  'binary': BinaryQuestType;
  'multi': MultiQuestType;
  'gradu': GraduQuestType;
};

export type {
  QuestType,
  GraduQuestType,
  MultiQuestType,
  BinaryQuestType,
  QuestTypes,
  QuestTypeMap,
};
