import { BinaryQuestType, GraduQuestType, MultiQuestType, QuestTypes } from "../../../primitives";

export type Table = { [name: string]: number[] | string[] | boolean[] };

export interface TableStrategy<Q extends QuestTypes> {
  getItemsTable(attrs: Q): Table;
  getUsersTable(attrs: Q): Table;
}

export class TableStrategyMulti implements TableStrategy<MultiQuestType> {
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

export class TableStrategyBinary implements TableStrategy<BinaryQuestType> {
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

export class TableStrategyGradu implements TableStrategy<GraduQuestType> {
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
