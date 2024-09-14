import { BinaryQuestType, GraduQuestType, MultiQuestType, QuestType } from "../../../primitives";

export type Table = { [name: string]: number[] | string[] | boolean[] };

export interface TableStrategy<Q> {
  getItemsTable(attrs: Q): Table;
  getUsersTable(attrs: Q): Table;
}

export abstract class TableStrategyBase<Q extends QuestType> implements TableStrategy<Q> {
  abstract getItemsTable(attrs: Q): Table;
  abstract getUsersTable(attrs: Q): Table;
}

export class TableStrategyMulti extends TableStrategyBase<MultiQuestType> {
  public getItemsTable(attrs: MultiQuestType): Table {
    return {
      'Items': attrs.keys,
      'Enabled': attrs.itemsEnabled,
    };
  }

  public getUsersTable(attrs: MultiQuestType): Table {
    return {
      'Enabled': attrs.usersEnabled,
    };
  }
}

export class TableStrategyBinary extends TableStrategyBase<BinaryQuestType> {
  public getItemsTable(attrs: BinaryQuestType): Table {
    return {
      'Items': attrs.keys,
      'Enabled': attrs.itemsEnabled,
    };
  }

  public getUsersTable(attrs: BinaryQuestType): Table {
    return {
      'Enabled': attrs.usersEnabled,
    };
  }
}

export class TableStrategyGradu extends TableStrategyBase<GraduQuestType> {
  public getItemsTable(attrs: GraduQuestType): Table {
    return {
      'Items': attrs.keys,
      'Enabled': attrs.itemsEnabled,
    };
  }

  public getUsersTable(attrs: GraduQuestType): Table {
    return {
      'Enabled': attrs.usersEnabled,
    };
  }
}
