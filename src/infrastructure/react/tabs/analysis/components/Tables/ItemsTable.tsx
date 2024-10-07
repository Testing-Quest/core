import React, { useCallback, useState, useMemo } from 'react'
import { Spin, Table, Button, Input } from 'antd'
import spinnerStyles from '../../../../App.module.css'
import { useSettings } from '../../../../context/SettingContext'
import type { Client } from '../../../../../Client'
import { useTableData } from './hooks/useTableData'
import type { TableRow } from './types'
import { createColumns } from './utils/columnCreator'

type PanelProps = {
  client: Client
}

export const ItemsTable: React.FC<PanelProps> = ({ client }) => {
  const { data, loading, states, setStates, refreshData } = useTableData(client, 'getItemsTable')
  const [keyChanges, setKeyChanges] = useState<Record<number, string>>({})
  const { fontSize } = useSettings()

  const handleCheckboxToggle = useCallback(
    (index: number) => {
      setStates(prev => {
        const newState = [...prev]
        newState[index] = {
          deactivated: !newState[index].deactivated,
          changed: !newState[index].changed,
        }
        return newState
      })
    },
    [setStates],
  )

  const handleKeyChange = useCallback((index: number, value: string) => {
    if (/^[a-zA-Z+-]?$/.test(value)) {
      setKeyChanges(prev => ({ ...prev, [index]: value }))
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    const deactivatedItems = states.map(state => !state.deactivated)
    const updatedKeys = data?.Key.map((key, index) => keyChanges[index] ?? key) || []
    try {
      await client.updateQuest({
        activeUsers: null,
        activeItems: deactivatedItems,
        keys: updatedKeys,
      })
      refreshData()
      setKeyChanges({})
    } catch (error) {
      console.error('Error updating items:', error)
    }
  }, [states, keyChanges, data, client, refreshData])

  const columns = useMemo(() => {
    if (!data) return []
    const initialColumns = createColumns(data, states, handleCheckboxToggle)
    return initialColumns.map(column => {
      if (column.key === 'Key') {
        return {
          ...column,
          width: 80,
          render: (_: any, record: TableRow) => (
            <Input
              value={keyChanges[record.key] ?? (data.Key[record.key] as string)}
              onChange={e => handleKeyChange(record.key, e.target.value)}
              maxLength={1}
              style={{ width: '100%', minWidth: '50px' }} // Ensure the input takes full width of the column
            />
          ),
        }
      }
      return column
    })
  }, [data, states, handleCheckboxToggle, handleKeyChange, keyChanges])

  const tableRows: TableRow[] = useMemo(() => {
    if (!data) return []
    return data.Id.map((_, rowIndex) => {
      const rowData: TableRow = { key: rowIndex }
      Object.entries(data).forEach(([columnKey, columnValues]) => {
        const cellValue = columnValues[rowIndex]
        if (columnKey === 'Key') {
          rowData[columnKey] = cellValue
        } else {
          rowData[columnKey] =
            typeof cellValue === 'number' && !Number.isInteger(cellValue) ? Number(cellValue.toFixed(2)) : cellValue
        }
      })
      return rowData
    })
  }, [data, keyChanges])

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading item data...' size='large' />
      </div>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  const rowClassName = (record: TableRow) => {
    return states[record.key].deactivated ? 'deactivated-row' : ''
  }

  const isAnyItemChanged = states.some(state => state.changed) || Object.keys(keyChanges).length > 0

  return (
    <div>
      <Table
        dataSource={tableRows}
        columns={columns}
        scroll={{ x: 1500 }}
        style={{ fontSize: `${fontSize}px` }}
        rowClassName={rowClassName}
      />
      {isAnyItemChanged && <Button onClick={handleSubmit}>Update Items</Button>}
    </div>
  )
}
