import React, { useMemo } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: string
  frequency: number
}

interface KeyTableProps {
  keys: string[]
  fontSize: string
}

const KeyTable: React.FC<KeyTableProps> = ({ keys, fontSize }) => {
  const tableData: DataType[] = useMemo(() => {
    const frequencyMap = keys.reduce(
      (acc, key) => {
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const total = keys.length

    return Object.entries(frequencyMap).map(([key, count]) => ({
      key,
      frequency: Number(((count / total) * 100).toFixed(2)),
    }))
  }, [keys])

  const columns: ColumnsType<DataType> = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text: number) => `${text}%`,
    },
  ]

  return <Table columns={columns} dataSource={tableData} pagination={false} size='middle' style={{ fontSize }} />
}

export default KeyTable
