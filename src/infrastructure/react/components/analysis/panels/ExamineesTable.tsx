import React from 'react'
import type { questGradu } from '../../../domain/quests/questGradu'
import type { questMulti } from '../../../domain/quests/questMulti'
import { Table } from 'antd'

type PanelProps = {
  quest: questGradu | questMulti
}

export const ExamineeTable: React.FC<PanelProps> = ({ quest }) => {
  // Renderiza el contenido del panel en función de la opción seleccionada
  const table: Map<string, (string | number)[]> = quest.getExamineesTable()

  // Columns are keys of the table
  const columns = Array.from(table.keys()).map(key => {
    return { title: key, dataIndex: key, key: key, width: 120 }
  })

  const tableRows = table
    .values()
    .next()
    .value.map((_: number, rowIndex: number) => {
      const rowData: Record<string, string | number> = {}

      Array.from(table.keys()).forEach(columnKey => {
        const columnValues = table.get(columnKey)
        const cellValue = columnValues ? columnValues[rowIndex] : ''

        // Formatea los números a 2 decimales si es un número y tiene más de dos decimales
        if (typeof cellValue === 'number') {
          rowData[columnKey] = Number.isInteger(cellValue) ? cellValue : cellValue.toFixed(2)
        } else {
          rowData[columnKey] = cellValue
        }
      })

      return rowData
    })
  return <Table dataSource={tableRows} columns={columns} scroll={{ x: 1500 }} />
}
