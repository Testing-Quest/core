import { AggregateRoot } from "../../shared/AggregateRoot";
import { QuestType } from "../../shared/quest";

export class BinaryQuest extends AggregateRoot {
  constructor() {
    super();
  }
  public static create(quest: QuestType): BinaryQuest { }
}
