import React from 'react';
import { questGradu } from '../../../domain/quests/questGradu';
import { questMulti } from '../../../domain/quests/questMulti';

interface PanelProps {
  quest: questGradu | questMulti;
}

export const ExamineeTable: React.FC<PanelProps> = ({ quest }) => {
  // Renderiza el contenido del panel en función de la opción seleccionada

  return <div>DIRECT VS EXaminees</div>;
};

