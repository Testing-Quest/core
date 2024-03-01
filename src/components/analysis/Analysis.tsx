import React, { useState } from 'react';
import { useGlobalState } from '../GlobalState';
import Sidebar from './Sidebar';
import { HealthMulti } from './panels/HealthMulti';
import { HealthGradu } from './panels/HealthGradu';
import { HealthBinary } from './panels/HealthBinary';
import { Reliability } from './panels/Reliability';
import { DirectVsWeighted } from './panels/DirectWeighted';
import { DirectVsBlank } from './panels/DirectBlank';
import { DirectVsCoherency } from './panels/DirectCoherency';
import { DirectVsMCI } from './panels/DirectMci';
import { ScoreDistribution } from './panels/ScoreDistribution';
import { ItemTable } from './panels/ItemsTable';
import { ExamineeTable } from './panels/ExamineesTable';
import { QuestType } from '../../application/dtos/questDtos';
import { ItemMaps } from './panels/ItemsMap';
import { PanelProps } from './panels/Panel';

interface AnalysisVisualization {
  label: string;
  icon: string;
  multi: React.FC<PanelProps> | null;
  gradu: React.FC<PanelProps> | null;
  binary: React.FC<PanelProps> | null;
}

const AnalysisVisualizations: AnalysisVisualization[] = [
  { label: "Health", icon: "basic", multi: HealthMulti, gradu: HealthGradu, binary: HealthBinary },
  { label: "Reliability", icon: "plot", multi: Reliability, gradu: Reliability, binary: Reliability },
  { label: "Items Map", icon: "plot", multi: ItemMaps, gradu: ItemMaps, binary: ItemMaps },
  { label: "Direct Weighted", icon: "plot", multi: DirectVsWeighted, gradu: null, binary: DirectVsWeighted },
  { label: "Direct Blank", icon: "plot", multi: DirectVsBlank, gradu: null, binary: DirectVsBlank },
  { label: "Direct Coherency", icon: "plot", multi: DirectVsCoherency, gradu: null, binary: DirectVsCoherency },
  { label: "Direct MCI", icon: "plot", multi: DirectVsMCI, gradu: null, binary: DirectVsMCI },
  { label: "Score Distribution", icon: "plot", multi: ScoreDistribution, gradu: ScoreDistribution, binary: ScoreDistribution },
  { label: "Items Table", icon: "table", multi: ItemTable, gradu: ItemTable, binary: ItemTable },
  { label: "Examinees Table", icon: "table", multi: ExamineeTable, gradu: ExamineeTable, binary: ExamineeTable }
]

export interface VisualizationItem {
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  quest_id: string;
}

const Analysis: React.FC = () => {
  const { analysisQuests } = useGlobalState();

  const type = analysisQuests[0].type;

  const visualizations: VisualizationItem[] = AnalysisVisualizations
    .reduce((acc, v) => {
      const component = type === QuestType.gradu ? v.gradu : type === QuestType.multi ? v.multi : v.binary;

      if (component !== null) {
        acc.push({
          label: v.label,
          icon: v.icon,
          component: component,
          quest_id: analysisQuests[0].id
        });
      }

      return acc;
    }, [] as VisualizationItem[]);

  const [selectedPanel, setSelectedPanel] = useState(visualizations[0]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Sidebar 
        name={analysisQuests[0].name} 
        onSidebarClick={(option) => setSelectedPanel(option)} 
        sidebarOptions={visualizations} 
      />
      <div style={{ flex: 1, textAlign: 'center' }}>
        {
          (selectedPanel.quest_id != analysisQuests[0].id) ?
          <div> </div> :
          <selectedPanel.component 
          quest={analysisQuests[0].quest}
          />
        }
      </div>
    </div>
  );
};

export default Analysis;
