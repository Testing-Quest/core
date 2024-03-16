import React from 'react';
import { questGradu } from '../../../domain/quests/questGradu';
import { questMulti } from '../../../domain/quests/questMulti';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from 'recharts';
import { ReferenceLine } from 'recharts';
import { Label } from 'recharts';

interface DataPoint {
  x: number;
  y: number;
  hover: number;
}

interface PanelProps {
  quest: questGradu | questMulti;
}

export const ItemMaps: React.FC<PanelProps> = ({ quest }) => {
  const items_map = quest.getItemsMap();

  const x = items_map.getX();
  const y = items_map.getY();
  const hover = items_map.getHoverInfo();

  const data: DataPoint[] = x.map((value, index) => ({
    x: value,
    y: y[index],
    hover: hover[index],
  }));

  var y_domain;
  var y_ticks;

  var x1, x2, x3, x4;
  if (quest.getType() === 'multi') {
    y_domain = [0, 1];
    y_ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    x1 = 0.2;
    x2 = 0.4;
    x3 = 0.6;
    x4 = 0.8;
  } else {
    y_domain = [1, quest.getNumberOfAnswers()];
    // desde 1 hasta el número de respuestas de 0.1 en 0.1
    y_ticks = Array.from({ length: quest.getNumberOfAnswers() * 10 }, (_, index) => ((index + 1) / 10).toFixed(1));
    const answers = quest.getNumberOfAnswers();
    x1 = 1 + (0.2 * (answers - 1))
    x2 = 1 + (0.4 * (answers - 1))
    x3 = 1 + (0.6 * (answers - 1))
    x4 = 1 + (0.8 * (answers - 1))
  }
  // ticks es una lista de 0.1 en 0.1 desde -1 hasta 1
  const ticks = [-1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

  return (
    <div style={{ height: '600px', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
      <ResponsiveContainer width="90%" height={500}>
        <ScatterChart margin={{ bottom: 15 }}>
          <CartesianGrid strokeDasharray="0 0" opacity={0.5} />
          <XAxis type="number" dataKey="x" name="X" ticks={y_ticks} domain={y_domain} >
            <Label value="Difficulty" position="insideBottom" offset={-8} fontSize={18} fill=""/>
            <Text />
          </XAxis>
          <YAxis type="number" ticks={ticks} dataKey="y" name="Y" domain={[-1, 1]} >
            <Label value="Discrimination" angle={-90} position="insideLeft" offset={8} fontSize={18} fill=""/>
          </YAxis>
          {/* COLORES */}
          <rect x={60} y={1} width={"99%"} height={46 * 2.5} fill="green" fillOpacity={0.4} />
          <rect x={60} y={115} width={"99%"} height={46} fill="yellow" fillOpacity={0.4} />
          <rect x={60} y={160} width={"99%"} height={23} fill="orange" fillOpacity={0.4} />
          <rect x={60} y={182} width={"99%"} height={46 * 2} fill="red" fillOpacity={0.4} />
          <rect x={60} y={272} width={"99%"} height={46 * 4} fill="black" fillOpacity={0.4} />
          {/* 4 Lineas Horizontales */}
          <ReferenceLine y={0} stroke="black" />
          {/* 4 Lineas Verticales */}
          <ReferenceLine x={x1} stroke="black" />
          <ReferenceLine x={x2} stroke="black" />
          <ReferenceLine x={x3} stroke="black" />
          <ReferenceLine x={x4} stroke="black" />
          { /* Letras Horizontales */}
          <text
            x='98%'
            y='74%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            4
          </text>
          <text
            x='98%'
            y='45%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            5
          </text>
          <text
            x='98%'
            y='35.4%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            3
          </text>
          <text
            x='98%'
            y='28.5%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            2
          </text>
          <text
            x='98%'
            y='15%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            1
          </text>
          {/* Letras Verticales */}
          <text
            x='90%'
            y='90%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            A
          </text>
          <text
            x='71%'
            y='90%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            B
          </text>
          <text
            x='51.7%'
            y='90%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            C
          </text>
          <text
            x='32.6%'
            y='90%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            D
          </text>
          <text
            x='13.5%'
            y='90%'
            style={{ fontSize: 16, fill: '#000000' }}
          >
            E
          </text>
          <Scatter name="Items" data={data} fill="#4f4f4f" />
          <Tooltip content={<CustomTooltip />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload as DataPoint;
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Item: ${point.hover}`}</p>
        <p>{`Difficulty: ${point.x.toFixed(2)}`}</p>
        <p>{`Discrimination: ${point.y.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};
