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
      Key: attrs.keys,
      Variance: mapArrayWithEnabled(attrs.itemsEnabled, items.variance),
      Discrimination: mapArrayWithEnabled(attrs.itemsEnabled, items.discrimination),
      'Corr Disc': mapArrayWithEnabled(attrs.itemsEnabled, items.corrDiscrimination),
      Difficulty: mapArrayWithEnabled(attrs.itemsEnabled, items.difficulty),
      ...Object.fromEntries(
        Object.entries(items.altDifficulty).map(([key, value]) => [
          key,
          mapArrayWithEnabled(attrs.itemsEnabled, value),
        ]),
      ),
    }
  }

  public getBaseUsersTable(attrs: UsersTableAttrs, users: QuestTypesMap[T]['calcs']['users']): Table {
    return {
      Id: attrs.usersIds.map(n => n + 1),
      Deactivate: attrs.usersEnabled,
      'Direct Score': mapArrayWithEnabled(attrs.usersEnabled, users.directScore),
      Mean: mapArrayWithEnabled(attrs.usersEnabled, users.mean),
      'Total Score': mapArrayWithEnabled(attrs.usersEnabled, users.totalScore),
      'Blank Answer': mapArrayWithEnabled(attrs.usersEnabled, users.blankAnswer),
    }
  }

  public abstract getItemsTable(attrs: ItemsTableAttrs, items: QuestTypesMap[T]['calcs']['items']): Table
  public abstract getUsersTable(attrs: UsersTableAttrs, users: QuestTypesMap[T]['calcs']['users']): Table
}

export function mapArrayWithEnabled(
  enabledArray: boolean[],
  valueArray: (string | number | boolean)[],
  defaultValue = '-',
) {
  let valueIndex = 0 // Índice para recorrer el array de valores

  return enabledArray.map(enabled => (enabled ? valueArray[valueIndex++] : defaultValue))
}
