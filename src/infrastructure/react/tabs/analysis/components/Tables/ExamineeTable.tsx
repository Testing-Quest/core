import React, { useCallback } from 'react'
import { Spin, Table, Button } from 'antd'
import spinnerStyles from '../../../../App.module.css'
import type { Client } from '../../../../../Client'
import { useTableData } from './hooks/useTableData'
import type { TableRow } from './types'
import { createColumns } from './utils/columnCreator'
import { useSettings } from '../../../../context/useSettings'

type PanelProps = {
  client: Client
  setDeactivatedExaminees(examinees: number[]): void
}

export const ExamineeTable: React.FC<PanelProps> = ({ client, setDeactivatedExaminees }) => {
  const { data, loading, states, setStates, refreshData } = useTableData(client, 'getUsersTable')
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

  const handleSubmit = useCallback(async () => {
    const deactivatedUsers = states.map(state => !state.deactivated)
    try {
      await client.updateQuest({
        activeUsers: deactivatedUsers,
        activeItems: null,
        keys: null,
      })

      refreshData()
      setDeactivatedExaminees(
        deactivatedUsers.map((deactivated, index) => (!deactivated ? index + 1 : -1)).filter(index => index !== -1),
      )
    } catch (error) {
      console.error('Error updating users:', error)
    }
  }, [states, client, refreshData, setDeactivatedExaminees])

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading examinee data...' size='large' />
      </div>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  const columns = createColumns(data, states, handleCheckboxToggle)

  const tableRows: TableRow[] = data.Id.map((_, rowIndex) => {
    const rowData: TableRow = { key: rowIndex }
    Object.entries(data).forEach(([columnKey, columnValues]) => {
      const cellValue = columnValues[rowIndex]
      rowData[columnKey] =
        typeof cellValue === 'number' && !Number.isInteger(cellValue) ? Number(cellValue.toFixed(2)) : cellValue
    })
    return rowData
  })

  const rowClassName = (record: TableRow) => {
    return states[record.key].deactivated ? 'deactivated-row' : ''
  }

  const isAnyUserChanged = states.some(state => state.changed)

  return (
    <div>
      <Table
        dataSource={tableRows}
        columns={columns}
        scroll={{ x: 1500 }}
        style={{ fontSize: `${fontSize}px` }}
        rowClassName={rowClassName}
      />
      {isAnyUserChanged && <Button onClick={handleSubmit}>Update Examinees</Button>}
    </div>
  )
}
