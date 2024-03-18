import React, { useState, useEffect } from 'react';
import { questMulti } from '../../../domain/quests/questMulti';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from 'recharts';
import { Label } from 'recharts';
import { Spin } from 'antd';

interface DataPoint {
  x: number;
  y: number;
  hover: number;
}

interface PanelProps {
  quest: questMulti;
}

export const DirectVsCoherency: React.FC<PanelProps> = ({ quest }) => {
  const [loading, setLoading] = useState(true); // Estado para el componente de carga
  const [data, setData] = useState<DataPoint[]>([]); // Estado para los datos

  useEffect(() => {
    const items_map = quest.directVsCoherency();

    const x = items_map.getX();
    const y = items_map.getY();
    const hover = items_map.getHoverInfo();

    const newData: DataPoint[] = x.map((value, index) => ({
      x: value,
      y: y[index],
      hover: hover[index],
    }));

    // Simular una carga más larga con un retraso de 1 segundo
    setTimeout(() => {
      setData(newData);
      setLoading(false); // Desactivar el componente de carga
    }, 1);
  }, [quest]);

  return (
    <div style={{ height: '600px', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
      {loading ? ( // Mostrar el componente de carga si loading es true
        <Spin size="large" />
      ) : (
        <ResponsiveContainer width="90%" height={500}>
          <ScatterChart margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray="0 0" opacity={0.5} />
            <XAxis type="number" dataKey="x" name="X" >
              <Label value="Direct Score" position="insideBottom" offset={-8} fontSize={18} fill=""/>
              <Text />
            </XAxis>
            <YAxis type="number" dataKey="y" name="Y" >
              <Label value="Coherency" angle={-90} position="insideLeft" offset={8} fontSize={18} fill=""/>
            </YAxis>
            <Scatter name="Items" data={data} isAnimationActive={false} fill="#8884d8" />
            <Tooltip content={<CustomTooltip />} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload as DataPoint;
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Examinee: ${point.hover}`}</p>
        <p>{`Weighted: ${point.y.toFixed(2)}`}</p>
        <p>{`Direct: ${point.x.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};
