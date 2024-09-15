import type {
  BinaryQuestType,
  GraduQuestType,
  MultiQuestType,
  QuestTypesMap,
} from '../../../primitives'

export type Table = Record<string, number[] | string[] | boolean[]>

export type TableStrategy<T extends keyof QuestTypesMap> = {
  getItemsTable(
    items: QuestTypesMap[T]['calcs']['items'],
    keys: QuestTypesMap[T]['keys'],
  ): Table
  getUsersTable(calcs: QuestTypesMap[T]['calcs']['users']): Table
}

export class TableStrategyMulti implements TableStrategy<'multi'> {
  public getItemsTable(
    items: MultiQuestType['calcs']['items'],
    keys: MultiQuestType['keys'],
  ): Table {
    return {
      Items: keys,
      Enabled: items.itemsEnabled,
    }
  }

  public getUsersTable(users: MultiQuestType['calcs']['users']): Table {
    return {
      Enabled: users.usersEnabled,
    }
  }
}

export class TableStrategyBinary implements TableStrategy<'binary'> {
  public getItemsTable(
    items: BinaryQuestType['calcs']['items'],
    keys: BinaryQuestType['keys'],
  ): Table {
    return {
      Items: keys,
      Enabled: items.itemsEnabled,
    }
  }

  public getUsersTable(users: BinaryQuestType['calcs']['users']): Table {
    return {
      Enabled: users.usersEnabled,
    }
  }
}

export class TableStrategyGradu implements TableStrategy<'gradu'> {
  public getItemsTable(
    items: GraduQuestType['calcs']['items'],
    keys: GraduQuestType['keys'],
  ): Table {
    return {
      Items: keys,
      Enabled: items.itemsEnabled,
    }
  }

  public getUsersTable(users: GraduQuestType['calcs']['users']): Table {
    return {
      Enabled: users.usersEnabled,
    }
  }
}
