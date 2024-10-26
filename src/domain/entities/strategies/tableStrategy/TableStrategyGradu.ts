import type { GraduItemsType } from '../../../primitives/calcs/items'
import type { GraduUsersType } from '../../../primitives/calcs/users'
import type { ItemsTableAttrs, Table, UsersTableAttrs } from './TableStrategy'
import { TableStrategyBase } from './TableStrategy'

export class TableStrategyGradu extends TableStrategyBase<'gradu'> {
  public getItemsTable(attrs: ItemsTableAttrs, items: GraduItemsType): Table {
    return this.getBaseItemsTable(attrs, items)
  }

  public getUsersTable(attrs: UsersTableAttrs, users: GraduUsersType): Table {
    return this.getBaseUsersTable(attrs, users)
  }
}
