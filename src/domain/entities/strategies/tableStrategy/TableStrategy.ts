import type { QuestTypesMap } from '../../../primitives'

export type Table = Record<string, (number | string | boolean)[]>

export type ItemsTableAttrs = {
  itemsEnabled: boolean[]
  itemsIds: number[]
  keys: string[]
}

export type UsersTableAttrs = {
  usersEnabled: boolean[]
  usersIds: number[]
}

export type TableStrategy<T extends keyof QuestTypesMap> = {
  getItemsTable(attrs: ItemsTableAttrs, items: QuestTypesMap[T]['calcs']['items']): Table
  getUsersTable(attrs: UsersTableAttrs, users: QuestTypesMap[T]['calcs']['users']): Table
}

export abstract class TableStrategyBase<T extends keyof QuestTypesMap> implements TableStrategy<T> {
  public getBaseItemsTable(attrs: ItemsTableAttrs, items: QuestTypesMap[T]['calcs']['items']): Table {
    return {
      Id: attrs.itemsIds.map(n => n + 1),
      Deactivate: attrs.itemsEnabled,
      Key: attrs.itemsEnabled.map((enabled, index) => (enabled ? attrs.keys[index] : '-')),
      Variance: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.variance[index] : '-')),
      Discrimination: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.discrimination[index] : '-')),
      CorrDiscrimination: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.corrDiscrimination[index] : '-')),
      Difficulty: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.difficulty[index] : '-')), // TODO: revisar esto.
      ...Object.fromEntries(
        Object.entries(items.altDifficulty).map(([key, value]) => [
          key,
          attrs.itemsEnabled.map((enabled, index) => (enabled ? value[index] : '-')),
        ]),
      ),
    }
  }

  public getBaseUsersTable(attrs: UsersTableAttrs, users: QuestTypesMap[T]['calcs']['users']): Table {
    return {
      Id: attrs.usersIds.map(n => n + 1),
      Deactivate: attrs.usersEnabled,
      'Direct Score': attrs.usersEnabled.map((enabled, index) => (enabled ? users.directScore[index] : '-')),
      Mean: attrs.usersEnabled.map((enabled, index) => (enabled ? users.mean[index] : '-')),
      'Total Score': attrs.usersEnabled.map((enabled, index) => (enabled ? users.totalScore[index] : '-')),
      'Blank Answer': attrs.usersEnabled.map((enabled, index) => (enabled ? users.blankAnswer[index] : '-')),
    }
  }

  public abstract getItemsTable(attrs: ItemsTableAttrs, items: QuestTypesMap[T]['calcs']['items']): Table
  public abstract getUsersTable(attrs: UsersTableAttrs, users: QuestTypesMap[T]['calcs']['users']): Table
}
