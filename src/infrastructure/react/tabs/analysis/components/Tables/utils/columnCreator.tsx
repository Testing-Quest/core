import type { ColumnsType } from 'antd/es/table'
import type { TableRow, DomainTable, ItemState } from '../types'
import CustomCheckbox from './CustomCheckbox'

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
        width: 30,
        render: (_, record) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CustomCheckbox
              checked={itemStates[record.key].deactivated}
              onChange={() => handleCheckboxToggle(record.key)}
              onClick={e => e.stopPropagation()}
            />
          </div>
        ),
      }
    }
    return {
      title: key,
      dataIndex: key,
      key: key,
      width: 30,
      render: (value: string | number | boolean, record) => {
        const isDeactivated = itemStates[record.key].deactivated
        return isDeactivated && key !== 'Id' && key !== 'Key' ? '-' : value
      },
    }
  })
}
