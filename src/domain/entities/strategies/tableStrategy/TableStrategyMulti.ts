import type { MultiItemsType } from '../../../primitives/calcs/items'
import type { MultiUsersType } from '../../../primitives/calcs/users'
import type { ItemsTableAttrs, Table, UsersTableAttrs } from './TableStrategy'
import { mapArrayWithEnabled, TableStrategyBase } from './TableStrategy'

export class TableStrategyMulti extends TableStrategyBase<'multi'> {
  public getItemsTable(attrs: ItemsTableAttrs, items: MultiItemsType): Table {
    const baseItems = this.getBaseItemsTable(attrs, items)
    return {
      ...baseItems,
      conflict: mapArrayWithEnabled(
        attrs.itemsEnabled,
        items.conflict.map(conflict => (conflict ? 'NO!' : 'OK!')),
      ),
      choice: mapArrayWithEnabled(
        attrs.itemsEnabled,
        items.choice.map(choice => (choice ? 'OK!' : 'NO')),
      ),
      ...Object.fromEntries(
        Object.entries(items.altDiscrimination).map(([key, value]) => [
          key,
          mapArrayWithEnabled(attrs.itemsEnabled, value),
        ]),
      ),
    }
  }

  public getUsersTable(attrs: UsersTableAttrs, users: MultiUsersType): Table {
    const baseUsers = this.getBaseUsersTable(attrs, users)

    return {
      ...baseUsers,
      weightedScore: mapArrayWithEnabled(attrs.usersEnabled, users.weightedScore),
      coherence: mapArrayWithEnabled(attrs.usersEnabled, users.coherence),
      mci: mapArrayWithEnabled(attrs.usersEnabled, users.mci),
    }
  }
}
