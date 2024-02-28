import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../GlobalState';
import { useNavigate } from 'react-router-dom';
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

interface AnalysisVisualization {
  label: string;
  type: string;
  multi: React.ComponentType<any> | null;
  gradu: React.ComponentType<any> | null;
  binary: React.ComponentType<any> | null;
}

const AnalysisVisualizations: AnalysisVisualization[] = [
  { label: "Health", type: "basic", multi: HealthMulti, gradu: HealthGradu, binary: HealthBinary },
  { label: "Reliability", type: "plot", multi: Reliability, gradu: Reliability, binary: Reliability },
  { label: "Items Map", type: "plot", multi: ItemMaps, gradu: ItemMaps, binary: ItemMaps },
  { label: "Direct Weighted", type: "plot", multi: DirectVsWeighted, gradu: null, binary: DirectVsWeighted },
  { label: "Direct Blank", type: "plot", multi: DirectVsBlank, gradu: null, binary: DirectVsBlank },
  { label: "Direct Coherency", type: "plot", multi: DirectVsCoherency, gradu: null, binary: DirectVsCoherency },
  { label: "Direct MCI", type: "plot", multi: DirectVsMCI, gradu: null, binary: DirectVsMCI },
  { label: "Score Distribution", type: "plot", multi: ScoreDistribution, gradu: ScoreDistribution, binary: ScoreDistribution },
  { label: "Items Table", type: "table", multi: ItemTable, gradu: ItemTable, binary: ItemTable },
  { label: "Examinees Table", type: "table", multi: ExamineeTable, gradu: ExamineeTable, binary: ExamineeTable }
]

export interface VisualizationItem {
  label: string;
  type: string;
  component: React.ComponentType<any>;
}

const Analysis: React.FC = () => {
  const { analysisQuests } = useGlobalState();

  if (analysisQuests.length === 0) {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/examples');
    }, [navigate]);
    return null;
  };
  const type = analysisQuests[0].type;

  var visualizations: VisualizationItem[] = AnalysisVisualizations
  .reduce((acc, v) => {
    const component = type === QuestType.gradu ? v.gradu : type === QuestType.multi ? v.multi : v.binary;
    
    if (component !== null) {
      acc.push({
        label: v.label,
        type: v.type,
        component: component
      });
    }

    return acc;
  }, [] as VisualizationItem[]);

  const [selectedOption, setSelectedOption] = useState(visualizations[0]);

  const handleSidebarClick = (option: VisualizationItem) => {
    setSelectedOption(option);
  };


  return (
    <div>
      <Sidebar name={analysisQuests[0].name} onSidebarClick={handleSidebarClick} sidebarOptions={visualizations} />
      {<selectedOption.component />}
    </div>
  );
};

export default Analysis;
