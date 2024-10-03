import React from 'react'
import { Typography } from 'antd'
import type { AnalysisQuest } from './AnalysisQuest'
import { Client } from '../../../Client'

const { Text } = Typography

type AnalysisTabProps = {
  quest: AnalysisQuest
}

// type AnalysisVisualization = {
//   label: string
//   icon: string
//   multi: React.FC<any> | null
//   gradu: React.FC<any> | null
//   binary: React.FC<any> | null
// }

// const AnalysisVisualizations: AnalysisVisualization[] = [
//   { label: "Health", icon: "basic", multi: HealthMulti, gradu: HealthGradu, binary: HealthBinary },
//   { label: "Reliability", icon: "plot", multi: Reliability, gradu: Reliability, binary: Reliability },
//   { label: "Items Map", icon: "plot", multi: ItemMaps, gradu: ItemMaps, binary: ItemMaps },
//   { label: "Direct Weighted", icon: "plot", multi: DirectVsWeighted, gradu: null, binary: DirectVsWeighted },
//   { label: "Direct Blank", icon: "plot", multi: DirectVsBlank, gradu: DirectVsBlank, binary: DirectVsBlank },
//   { label: "Direct Coherency", icon: "plot", multi: DirectVsCoherency, gradu: null, binary: DirectVsCoherency },
//   { label: "Direct MCI", icon: "plot", multi: DirectVsMCI, gradu: null, binary: DirectVsMCI },
//   { label: "Score Distribution", icon: "plot", multi: ScoreDistribution, gradu: ScoreDistribution, binary: ScoreDistribution },
//   { label: "Items Table", icon: "table", multi: ItemTable, gradu: ItemTable, binary: ItemTable },
//   { label: "Examinees Table", icon: "table", multi: ExamineeTable, gradu: ExamineeTable, binary: ExamineeTable }
// ]

const AnalysisTab: React.FC<AnalysisTabProps> = ({ quest }) => {
  const client = new Client(quest)
  console.log(client)

  return (
    <div className='p-4'>
      <Text className='text-base'>Analysis content for {quest.name} goes here.</Text>
    </div>
  )
}

export default AnalysisTab
