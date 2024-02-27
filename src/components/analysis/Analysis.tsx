import React from 'react';
import { useGlobalState } from '../GlobalState';

const Analysis: React.FC = () => {
  const { analysisQuests } = useGlobalState();

  return (
    <div>
      <h1>Analysis</h1>
      <p>Cantidad de Quests en el estado global: {analysisQuests.length}</p>
      {analysisQuests.map((quest) => (
        <div key={quest.id}>
          <p>ID del Quest: {quest.id}</p>
          <button onClick={() => console.log(analysisQuests)}>Mostrar Quest</button>
          {/* Renderizar otras propiedades del Quest según sea necesario */}
        </div>
      ))}
    </div>
  );
};

export default Analysis;
