import { Health } from './components/Health'
import { Reliability } from './components/Plots/Reliability'
import { ItemsMap } from './components/Plots/ItemsMap'
import { DirectWeight } from './components/Plots/DirectWeight'
import { DirectBlank } from './components/Plots/DirectBlank'
import { DirectMci } from './components/Plots/DirectMci'
import { DirectCoherency } from './components/Plots/DirectCoherency'
import { ScoreDistribution } from './components/Plots/ScoreDistribution'
import { ExamineeTable } from './components/Tables/ExamineeTable'
import { ItemsTable } from './components/Tables/ItemsTable'
import type { AnalysisVisualization } from './types'

export const analysisVisualizations: AnalysisVisualization[] = [
  { label: 'Health', icon: 'basic', multi: Health, gradu: Health, binary: Health },
  { label: 'Reliability', icon: 'plot', multi: Reliability, gradu: Reliability, binary: Reliability },
  { label: 'Items Map', icon: 'plot', multi: ItemsMap, gradu: ItemsMap, binary: ItemsMap },
  { label: 'Direct Weighted', icon: 'plot', multi: DirectWeight, gradu: null, binary: DirectWeight },
  { label: 'Direct Blank', icon: 'plot', multi: DirectBlank, gradu: DirectBlank, binary: DirectBlank },
  { label: 'Direct Coherency', icon: 'plot', multi: DirectCoherency, gradu: null, binary: DirectCoherency },
  { label: 'Direct MCI', icon: 'plot', multi: DirectMci, gradu: null, binary: DirectMci },
  {
    label: 'Score Distribution',
    icon: 'plot',
    multi: ScoreDistribution,
    gradu: ScoreDistribution,
    binary: ScoreDistribution,
  },
  { label: 'Items Table', icon: 'table', multi: ItemsTable, gradu: ItemsTable, binary: ItemsTable },
  { label: 'Examinees Table', icon: 'table', multi: ExamineeTable, gradu: ExamineeTable, binary: ExamineeTable },
]
