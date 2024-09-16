import React, { useState } from 'react'
import { useGlobalState } from '../GlobalState'
import Sidebar from './Sidebar'
import { HealthMulti } from './panels/HealthMulti'
import { HealthGradu } from './panels/HealthGradu'
import { HealthBinary } from './panels/HealthBinary'
import { Reliability } from './panels/Reliability'
import { DirectVsWeighted } from './panels/DirectWeighted'
import { DirectVsBlank } from './panels/DirectBlank'
import { DirectVsCoherency } from './panels/DirectCoherency'
import { DirectVsMCI } from './panels/DirectMci'
import { ScoreDistribution } from './panels/ScoreDistribution'
import { ItemTable } from './panels/ItemsTable'
import { ExamineeTable } from './panels/ExamineesTable'
import { QuestType } from '../../application/dtos/questDtos'
import { ItemMaps } from './panels/ItemsMap'
import { Spin } from 'antd'
import { DeactivatedElements } from './DeactivatedElements'

type AnalysisVisualization = {
  label: string
  icon: string
  multi: React.FC<any> | null
  gradu: React.FC<any> | null
  binary: React.FC<any> | null
}

const AnalysisVisualizations: AnalysisVisualization[] = [
  {
    label: 'Health',
    icon: 'basic',
    multi: HealthMulti,
    gradu: HealthGradu,
    binary: HealthBinary,
  },
  {
    label: 'Reliability',
    icon: 'plot',
    multi: Reliability,
    gradu: Reliability,
    binary: Reliability,
  },
  {
    label: 'Items Map',
    icon: 'plot',
    multi: ItemMaps,
    gradu: ItemMaps,
    binary: ItemMaps,
  },
  {
    label: 'Direct Weighted',
    icon: 'plot',
    multi: DirectVsWeighted,
    gradu: null,
    binary: DirectVsWeighted,
  },
  {
    label: 'Direct Blank',
    icon: 'plot',
    multi: DirectVsBlank,
    gradu: DirectVsBlank,
    binary: DirectVsBlank,
  },
  {
    label: 'Direct Coherency',
    icon: 'plot',
    multi: DirectVsCoherency,
    gradu: null,
    binary: DirectVsCoherency,
  },
  {
    label: 'Direct MCI',
    icon: 'plot',
    multi: DirectVsMCI,
    gradu: null,
    binary: DirectVsMCI,
  },
  {
    label: 'Score Distribution',
    icon: 'plot',
    multi: ScoreDistribution,
    gradu: ScoreDistribution,
    binary: ScoreDistribution,
  },
  {
    label: 'Items Table',
    icon: 'table',
    multi: ItemTable,
    gradu: ItemTable,
    binary: ItemTable,
  },
  {
    label: 'Examinees Table',
    icon: 'table',
    multi: ExamineeTable,
    gradu: ExamineeTable,
    binary: ExamineeTable,
  },
]

export type VisualizationItem = {
  label: string
  icon: string
  component: React.ComponentType<any>
  quest_id: string
}

const Analysis: React.FC = () => {
  const { analysisQuests } = useGlobalState()
  const [loading, setLoading] = useState(false)

  const { type } = analysisQuests[0]

  const visualizations: VisualizationItem[] = AnalysisVisualizations.reduce<VisualizationItem[]>((acc, v) => {
    const component = type === QuestType.gradu ? v.gradu : type === QuestType.multi ? v.multi : v.binary

    if (component !== null) {
      acc.push({
        label: v.label,
        icon: v.icon,
        component: component,
        quest_id: analysisQuests[0].id,
      })
    }

    return acc
  }, [])

  const [selectedPanel, setSelectedPanel] = useState(visualizations[0])

  if (selectedPanel.quest_id != analysisQuests[0].id) {
    setSelectedPanel(visualizations[0])
  }

  const onReset = async () => {
    setLoading(true)
    setTimeout(async () => {
      await analysisQuests[0].quest.reset()
      setLoading(false)
    }, 10)
  }
  const onRecalculate = async () => {
    setLoading(true)
    setTimeout(async () => {
      await analysisQuests[0].quest.recalculate()
      setLoading(false)
    }, 10)
  }

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          position: 'fixed',
          left: 0,
          height: '100%',
          width: '14.7%',
          zIndex: 999,
        }}
      >
        <Sidebar
          name={analysisQuests[0].name}
          onSidebarClick={option => {
            setSelectedPanel(option)
          }}
          sidebarOptions={visualizations}
        />
      </div>
      <div style={{ marginLeft: '16%', width: '84%' }}>
        {loading ? (
          <Spin size='large' />
        ) : selectedPanel.quest_id !== analysisQuests[0].id ? (
          <Spin size='large' />
        ) : (
          <div>
            <div>
              <DeactivatedElements quest={analysisQuests[0].quest} onReset={onReset} />
            </div>
            <div>
              <selectedPanel.component quest={analysisQuests[0].quest} onRecalculate={onRecalculate} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis
