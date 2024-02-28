import React from 'react';
import { questMulti } from '../../domain/quests/questMulti';
import { questGradu } from '../../domain/quests/questGradu';

interface PanelProps {
  selectedOption: string;
  quest: questGradu | questMulti;
}

const Panel: React.FC<PanelProps> = ({ selectedOption, quest }) => {
  // Renderiza el contenido del panel en función de la opción seleccionada

  return <div>{quest.semValue}</div>;
};

export default Panel;
