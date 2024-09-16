import React, { useState } from 'react'
import type { questGradu } from '../../../domain/quests/questGradu'
import type { questMulti } from '../../../domain/quests/questMulti'
import { Table } from 'antd'

type PanelProps = {
  quest: questGradu | questMulti
}
type TableRow = {
  key: number
  name: string
  description: string
}
type ExpandedRowContentProps = {
  description: string
}

const ExpandedRowContent: React.FC<ExpandedRowContentProps> = ({
  description,
}) => (
  <div>
    <p>{`Additional information: ${description}`}</p>
    {/* Agrega aquí cualquier contenido adicional que desees */}
  </div>
)

export const ItemTable: React.FC<PanelProps> = ({ quest }) => {
  console.log(quest)

  const [expandedRowId, setExpandedRowId] = useState<number | null>(null)

  const data: TableRow[] = [
    { key: 1, name: 'Row 1', description: 'Description 1' },
    { key: 2, name: 'Row 2', description: 'Description 2' },
    // Agrega más filas según sea necesario
  ]

  const handleRowClick = (record: TableRow) => {
    setExpandedRowId(expandedRowId === record.key ? null : record.key)
  }

  const columns = [
    { title: 'ID', dataIndex: 'key', key: 'key' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const expandedRowRender = (record: TableRow) => (
    <ExpandedRowContent description={record.description} />
  )

  return (
    <Table
      dataSource={data}
      columns={columns}
      expandable={{
        expandedRowRender,
        expandedRowKeys: expandedRowId ? [expandedRowId] : [],
        onExpand: (_, record) => {
          handleRowClick(record)
        },
      }}
      onRow={record => ({
        onClick: () => {
          handleRowClick(record)
        },
      })}
    />
  )
}
