import React from 'react';
import { questGradu } from '../../../domain/quests/questGradu';
import { questMulti } from '../../../domain/quests/questMulti';
import { Table } from 'antd';

interface PanelProps {
  quest: questGradu | questMulti;
}

export const ItemTable: React.FC<PanelProps> = ({ quest }) => {
  // Renderiza el contenido del panel en función de la opción seleccionada
  const table: Map<string, (string | number)[]> = quest.getItemsTable();

  // Columns are keys of the table
  const columns = Array.from(table.keys()).map((key) => {
    return { 
      title: key, 
      dataIndex: key, 
      key: key, 
      width: 120,
      fixed: key === 'id' ? 'left' : undefined
    };
  });

  const tableRows = table.values().next().value.map((_: number, rowIndex: number) => {
    const rowData: { [key: string]: string | number } = {};

    Array.from(table.keys()).forEach((columnKey) => {
      const columnValues = table.get(columnKey);
      const cellValue = columnValues ? columnValues[rowIndex] : '';

      // Formatea los números a 2 decimales si es un número y tiene más de dos decimales
      if (typeof cellValue === 'number') {
        rowData[columnKey] = Number.isInteger(cellValue) ? cellValue : cellValue.toFixed(2);
      } else {
        rowData[columnKey] = cellValue;
      }
    });

    return rowData;
  });


  // Render the table of antd
  return (
    <div style={{maxWidth:"60%"}}>
      <Table dataSource={tableRows} columns={columns} scroll={{x: 1500}}/>
    </div>
  );
};

