import type { MultiItemsType } from '../../../primitives/calcs/items'
import type { MultiUsersType } from '../../../primitives/calcs/users'
import type { ItemsTableAttrs, Table, UsersTableAttrs } from './TableStrategy'
import { TableStrategyBase } from './TableStrategy'

export class TableStrategyMulti extends TableStrategyBase<'multi'> {
  public getItemsTable(attrs: ItemsTableAttrs, items: MultiItemsType): Table {
    const baseItems = this.getBaseItemsTable(attrs, items)
    return {
      ...baseItems,
      conflict: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.conflict[index] : '-')),
      choice: attrs.itemsEnabled.map((enabled, index) => (enabled ? items.choice[index] : '-')),
      ...Object.fromEntries(
        Object.entries(items.altDiscrimination).map(([key, value]) => [
          key,
          attrs.itemsEnabled.map((enabled, index) => (enabled ? value[index] : '-')),
        ]),
      ),
    }
  }

  public getUsersTable(attrs: UsersTableAttrs, users: MultiUsersType): Table {
    const baseUsers = this.getBaseUsersTable(attrs, users)

    return {
      ...baseUsers,
      weightedScore: attrs.usersEnabled.map((enabled, index) => (enabled ? users.weightedScore[index] : '-')),
      coherence: attrs.usersEnabled.map((enabled, index) => (enabled ? users.coherence[index] : '-')),
      mci: attrs.usersEnabled.map((enabled, index) => (enabled ? users.mci[index] : '-')),
    }
  }
}
