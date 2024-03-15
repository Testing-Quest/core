import React from 'react';
import { questGradu } from '../../../domain/quests/questGradu';
import { questMulti } from '../../../domain/quests/questMulti';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  x: number;
  y: number;
}

interface PanelProps {
  quest: questGradu | questMulti;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const x = payload[0].payload.x.toFixed(2); // Valor de x con dos decimales
    const y = payload[0].payload.y.toFixed(2); // Valor de y con dos decimales

    return (
      <div className="custom-tooltip">
        <p>Lenght: {x}</p>
        <p>Fiability: {y}</p>
      </div>
    );
  }

  return null;
};

export const Reliability: React.FC<PanelProps> = ({ quest }) => {
  const reliability = quest.calculateReliability();

  const x = reliability.getX();
  const y = reliability.getY();

  const data: DataPoint[] = x.map((value, index) => ({
    x: value,
    y: y[index],
  }));

  const handleClick = (point: any) => {
    if (point && point.activePayload && point.activePayload.length > 0) {
      const clickedPoint = point.activePayload[0].payload;
      console.log(`Clicked point - x: ${clickedPoint.x.toFixed(2)}, y: ${clickedPoint.y.toFixed(2)}`);
    }
  };


  return (
    <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight:'50px' }}>
      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={data} onClick={handleClick}>
          <CartesianGrid strokeDasharray="0 0" opacity={0.5} />
          <XAxis dataKey="x" type="number" tickCount={11} domain={[0.5, 1.5]} label={{ value: 'Longitud del test %', position: 'insideBottom', fill: '' }} />
          <YAxis domain={[0, 1]} tickCount={11} label={{ value: 'Fiabilidad', angle: -90, position: 'insideLeft', offset: 0, fill: '' }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
          <rect x={65} y={77.5} width={"99%"} height={35} fill="green" fillOpacity={0.3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

