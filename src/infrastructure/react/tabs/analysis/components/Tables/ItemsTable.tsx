import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { Spin, Table, Button, Input } from 'antd'
import spinnerStyles from '../../../../App.module.css'
import type { Client } from '../../../../../Client'
import { useTableData } from './hooks/useTableData'
import type { TableRow } from './types'
import { createColumns } from './utils/columnCreator'
import { ItemModal } from './modal/ItemModal'
import { useSettings } from '../../../../context/useSettings'

type PanelProps = {
  client: Client
  setDeactivatedItems(items: number[]): void
}

export const ItemsTable: React.FC<PanelProps> = ({ client, setDeactivatedItems }) => {
  const { data, loading, states, setStates, refreshData } = useTableData(client, 'getItemsTable')
  const [keyChanges, setKeyChanges] = useState<Record<number, string>>({})
  const { fontSize } = useSettings()
  const [modalState, setModalState] = useState({ visible: false, selectedItemId: null as number | null })
  const [modifications, setModifications] = useState<{ keys: string[]; originalKeys: string[] } | null>(null)

  useEffect(() => {
    const fetchModifications = async () => {
      try {
        const response = await client.getModifications()
        if (response.response) {
          setModifications({
            keys: response.response.keys,
            originalKeys: response.response.originalKeys,
          })
        }
      } catch (error) {
        console.error('Error fetching modifications:', error)
      }
    }
    fetchModifications()
  }, [client])

  const handleCheckboxToggle = useCallback(
    (index: number) => {
      setStates(prev =>
        prev.map((state, i) => (i === index ? { deactivated: !state.deactivated, changed: !state.changed } : state)),
      )
    },
    [setStates],
  )

  const handleKeyChange = useCallback((index: number, value: string) => {
    if (/^[a-zA-Z+-]?$/.test(value)) {
      setKeyChanges(prev => ({ ...prev, [index]: value }))
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      await client.updateQuest({
        activeUsers: null,
        activeItems: states.map(state => !state.deactivated),
        keys: data?.Key.map((key, index) => keyChanges[index] ?? key) || [],
      })
      refreshData()
      setKeyChanges({})
      setDeactivatedItems(
        states.map((state, index) => (state.deactivated ? index + 1 : -1)).filter(index => index !== -1),
      )
    } catch (error) {
      console.error('Error updating items:', error)
    }
  }, [states, keyChanges, data, client, refreshData, setDeactivatedItems])

  const handleRowClick = useCallback(
    (record: TableRow) => {
      if (!states[record.key].deactivated) {
        setModalState({ visible: true, selectedItemId: record.Id as number })
      }
    },
    [states],
  )

  const columns = useMemo(() => {
    if (!data || !modifications) return []
    return createColumns(data, states, handleCheckboxToggle).map(column =>
      column.key === 'Key'
        ? {
            ...column,
            width: 80,
            /* eslint-disable @typescript-eslint/no-explicit-any */
            render: (_: any, record: TableRow) => {
              const currentKey = keyChanges[record.key] ?? data.Key[record.key]
              const originalKey = modifications.originalKeys[record.key]
              const isModified = currentKey !== originalKey
              return (
                <Input
                  value={currentKey}
                  onChange={e => handleKeyChange(record.key, e.target.value)}
                  maxLength={1}
                  style={{
                    width: '100%',
                    minWidth: '50px',
                    backgroundColor: isModified ? '#ffd54f' : 'transparent',
                  }}
                  placeholder={originalKey}
                  onClick={e => e.stopPropagation()}
                />
              )
            },
          }
        : column,
    )
  }, [data, states, handleCheckboxToggle, handleKeyChange, keyChanges, modifications])

  const tableRows: TableRow[] = useMemo(() => {
    if (!data) return []
    return data.Id.map((id, rowIndex) => ({
      key: rowIndex,
      Id: id,
      ...Object.fromEntries(
        Object.entries(data)
          .filter(([key]) => key !== 'Id')
          .map(([key, values]) => [
            key,
            typeof values[rowIndex] === 'number' && !Number.isInteger(values[rowIndex])
              ? Number(values[rowIndex].toFixed(2))
              : values[rowIndex],
          ]),
      ),
    }))
  }, [data])

  if (loading) {
    return (
      <div className={spinnerStyles.loading}>
        <Spin tip='Loading item data...' size='large' />
      </div>
    )
  }

  if (!data || !modifications) {
    return <div>No data available</div>
  }

  const isAnyItemChanged = states.some(state => state.changed) || Object.keys(keyChanges).length > 0

  return (
    <div>
      <Table
        dataSource={tableRows}
        columns={columns}
        scroll={{ x: 1500 }}
        style={{ fontSize: `${fontSize}px` }}
        rowClassName={record => (states[record.key].deactivated ? 'deactivated-row' : 'clickable-row')}
        onRow={record => ({ onClick: () => handleRowClick(record) })}
      />
      {isAnyItemChanged && <Button onClick={handleSubmit}>Update Items</Button>}
      <ItemModal
        visible={modalState.visible}
        onClose={() => setModalState(prev => ({ ...prev, visible: false }))}
        itemId={modalState.selectedItemId}
        client={client}
      />
    </div>
  )
}
