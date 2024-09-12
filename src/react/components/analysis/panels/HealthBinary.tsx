import React from 'react';
import { questMulti } from '../../../domain/quests/questMulti';

interface PanelProps {
  quest: questMulti;
}

export const HealthBinary: React.FC<PanelProps> = ({ quest }) => {
  // Renderiza el contenido del panel en función de la opción seleccionada

  
  return (
      <div className="health-multi-panel">
      <div className="health-multi-section">
        <h3>Descriptive Statistics</h3>
        <p>Cronbach’s Alpha: {(quest.cronbachAlphaValue).toFixed(2)}</p>
        <p>SEM: {(quest.semValue).toFixed(2)}</p>
        <p>Mean: {(quest.meanValue).toFixed(2)}</p>
        <p>Variance: {(quest.varianceValue).toFixed(2)}</p>
        <p>Standard Desviation: {(quest.standardDeviationValue).toFixed(2)}</p>
      </div>

      <div className="health-multi-section">
        <h3>Reliability & Discrimination</h3>
        <p>Reliability: {(quest.reliabilityValue * 100).toFixed(2)}%</p>
        <p>Discrimination: {(quest.discriminationValue * 100).toFixed(2)}%</p>
        <p>Coherency: {(quest.coherencyValue*100).toFixed(2)}%</p>
      </div>

      <div className="health-multi-section">
        <h3>Test Health</h3>
        <p>Difficulty: {(quest.difficultyValue*100).toFixed(2)}%</p>
        <p>Test Health: {(quest.testHealthValue*100).toFixed(2)}%</p>
      </div>
    </div>
  );

};

