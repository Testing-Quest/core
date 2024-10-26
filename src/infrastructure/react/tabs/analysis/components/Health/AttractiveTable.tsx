import React from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type DataType = {
  key: string
  frequency: number
}

type AttractiveTableProps = {
  data: Record<string, number>
  fontSize: string
}

const AttractiveTable: React.FC<AttractiveTableProps> = ({ data, fontSize }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)

  const tableData: DataType[] = Object.entries(data).map(([key, value]) => ({
    key,
    frequency: Number(((value / total) * 100).toFixed(2)),
  }))

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

export default AttractiveTable
