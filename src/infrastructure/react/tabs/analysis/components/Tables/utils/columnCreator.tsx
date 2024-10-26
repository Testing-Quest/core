import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { TableRow, DomainTable, ItemState } from '../types'
import CustomCheckbox from './CustomCheckbox'

export const createColumns = (
  data: DomainTable,
  itemStates: ItemState[],
  handleCheckboxToggle: (index: number) => void,
): ColumnsType<TableRow> => {
  const createDeactivateColumn = (): ColumnsType<TableRow>[number] => ({
    title: 'Deactivate',
    dataIndex: 'Deactivate',
    key: 'Deactivate',
    width: 30,
    filters: [
      { text: 'Active', value: false },
      { text: 'Deactivated', value: true },
    ],
    onFilter: (value, record) => itemStates[record.key].deactivated === value,
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
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
      </div>
    ),
  })

  const createDataColumn = (key: string): ColumnsType<TableRow>[number] => {
    const column: ColumnsType<TableRow>[number] = {
      title: key,
      dataIndex: key,
      key: key,
      width: 30,
      render: (value: string | number | boolean, record: TableRow) => {
        const isDeactivated = itemStates[record.key].deactivated
        return isDeactivated && key !== 'Id' && key !== 'Key' ? '-' : value
      },
    }

    if (key === 'Id') {
      const uniqueIdValues = Array.from(new Set(data.Id))
      if (uniqueIdValues.length > 100) return column
      column.filters = uniqueIdValues.map(id => ({ text: id.toString(), value: id }))
      column.onFilter = (value, record) => record.Id === value
      column.filterSearch = true
    } else if (key === 'Key') {
      const uniqueKeyValues = Array.from(new Set(data.Key))
      column.filters = uniqueKeyValues.map(key => ({ text: key, value: key }))
      column.onFilter = (value, record) => data.Key[record.key] === value
    } else if (key !== 'Key') {
      column.sorter = (a: TableRow, b: TableRow, sortOrder) => {
        const aValue = a[key]
        const bValue = b[key]
        const aId = a['Id'] as number
        const bId = b['Id'] as number
        if (aValue === '-' && bValue === '-') {
          return aId - bId
        }
        if (aValue === '-') return sortOrder === 'ascend' ? 1 : -1
        if (bValue === '-') return sortOrder === 'ascend' ? -1 : 1
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue)
        }
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return aValue === bValue ? 0 : aValue ? -1 : 1
        }
        return 0
      }
    }
    return column
  }

  return Object.keys(data).map(key => (key === 'Deactivate' ? createDeactivateColumn() : createDataColumn(key)))
}
