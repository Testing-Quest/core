import type { BinaryItemsType } from '../../../primitives/calcs/items'
import type { BinaryUsersType } from '../../../primitives/calcs/users'
import type { ItemsTableAttrs, Table, UsersTableAttrs } from './TableStrategy'
import { mapArrayWithEnabled, TableStrategyBase } from './TableStrategy'

export class TableStrategyBinary extends TableStrategyBase<'binary'> {
  public getItemsTable(attrs: ItemsTableAttrs, items: BinaryItemsType): Table {
    const baseItems = this.getBaseItemsTable(attrs, items)

    return {
      ...baseItems,
      conflict: mapArrayWithEnabled(
        attrs.itemsEnabled,
        items.conflict.map(conflict => (conflict ? 'OK!' : 'NO!')),
      ),
      ...Object.fromEntries(
        Object.entries(items.altDiscrimination).map(([key, value]) => [
          key,
          mapArrayWithEnabled(attrs.itemsEnabled, value),
        ]),
      ),
    }
  }

  public getUsersTable(attrs: UsersTableAttrs, users: BinaryUsersType): Table {
    const baseUsers = this.getBaseUsersTable(attrs, users)

    return {
      ...baseUsers,
      weightedScore: mapArrayWithEnabled(attrs.usersEnabled, users.weightedScore),
      coherence: mapArrayWithEnabled(attrs.usersEnabled, users.coherence),
      mci: mapArrayWithEnabled(attrs.usersEnabled, users.mci),
    }
  }
}
