import React from 'react';
import { questMulti } from '../../../domain/quests/questMulti';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from 'recharts';
import { Label } from 'recharts';

interface DataPoint {
  x: number;
  y: number;
  hover: number;
}

interface PanelProps {
  quest: questMulti;
}

export const DirectVsMCI: React.FC<PanelProps> = ({ quest }) => {
  const items_map = quest.directVsMCI();

  const x = items_map.getX();
  const y = items_map.getY();
  const hover = items_map.getHoverInfo();

  const data: DataPoint[] = x.map((value, index) => ({
    x: value,
    y: y[index],
    hover: hover[index],
  }));


  return (
    <div style={{ height: '600px', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
      <ResponsiveContainer width="90%" height={500}>
        <ScatterChart margin={{ bottom: 15 }}>
          <CartesianGrid strokeDasharray="0 0" opacity={0.5} />
          <XAxis type="number" dataKey="x" name="X" >
            <Label value="Direct Score" position="insideBottom" offset={-8} fontSize={18} fill=""/>
            <Text />
          </XAxis>
          <YAxis type="number" dataKey="y" name="Y" >
            <Label value="MCI" angle={-90} position="insideLeft" offset={8} fontSize={18} fill=""/>
          </YAxis>
          <Scatter name="Items" data={data} isAnimationActive={false} fill="#4f4f4f" />
          <Tooltip content={<CustomTooltip />} />
        </ScatterChart>
      </ResponsiveContainer>
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
