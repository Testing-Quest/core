import React from 'react'
import type { Client } from '../../../Client'

export type QuestType = 'multi' | 'gradu' | 'binary'

export type VisualizationComponentProps = {
  client: Client
  setDeactivatedItems(items: number[]): void
  setDeactivatedExaminees(examinees: number[]): void
}

export type AnalysisVisualization = {
  label: string
  icon: string
} & {
  [key in QuestType]: React.FC<VisualizationComponentProps> | null
}

export type AnalysisQuest = {
  uuid: string
  type: 'multi' | 'gradu' | 'binary'
  scale: number
  name: string
}
