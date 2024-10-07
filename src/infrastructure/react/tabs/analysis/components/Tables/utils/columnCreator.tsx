import { Checkbox } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRow, DomainTable, ItemState } from '../types'

export const createColumns = (
  data: DomainTable,
  itemStates: ItemState[],
  handleCheckboxToggle: (index: number) => void,
): ColumnsType<TableRow> => {
  return Object.keys(data).map(key => {
    if (key === 'Deactivate') {
      return {
        title: key,
        dataIndex: key,
        key: key,
        width: 120,
        render: (_, record) => (
          <Checkbox
            checked={itemStates[record.key].deactivated}
            onChange={() => {
              handleCheckboxToggle(record.key)
            }}
          />
        ),
      }
    }
    return {
      title: key,
      dataIndex: key,
      key: key,
      width: 120,
      render: (value: string | number | boolean, record) => {
        const isDeactivated = itemStates[record.key].deactivated
        return isDeactivated && key !== 'Id' ? '-' : value
      },
    }
  })
}
