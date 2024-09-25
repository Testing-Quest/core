import type { BinaryItemsType } from '../../../primitives/calcs/items'
import type { BinaryUsersType } from '../../../primitives/calcs/users'
import type { ItemsTableAttrs, Table, UsersTableAttrs } from './TableStrategy'
import { TableStrategyBase } from './TableStrategy'

export class TableStrategyBinary extends TableStrategyBase<'binary'> {
  public getItemsTable(attrs: ItemsTableAttrs, items: BinaryItemsType): Table {
    const baseItems = this.getBaseItemsTable(attrs, items)

    return {
      ...baseItems,
      conflict: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.conflict[index] : '-')),
      ...Object.fromEntries(
        Object.entries(items.altDiscrimination).map(([key, value]) => [
          key,
          attrs.itemsEnabled.map((enabled, index) => (enabled ? value[index] : '-')),
        ]),
      ),
    }
  }

  public getUsersTable(attrs: UsersTableAttrs, users: BinaryUsersType): Table {
    const baseUsers = this.getBaseUsersTable(attrs, users)

    return {
      ...baseUsers,
      weightedScore: attrs.usersEnabled.map((enabled, index) => (enabled ? users.weightedScore[index] : '-')),
      coherence: attrs.usersEnabled.map((enabled, index) => (enabled ? users.coherence[index] : '-')),
      mci: attrs.usersEnabled.map((enabled, index) => (enabled ? users.mci[index] : '-')),
    }
  }
}
