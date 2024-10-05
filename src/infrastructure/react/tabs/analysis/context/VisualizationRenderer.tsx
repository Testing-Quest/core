import React from 'react'
import { useVisualization } from './VisualizationContext'
import type { VisualizationComponentProps, QuestType } from '../types'

type VisualizationRendererProps = {
  client: VisualizationComponentProps['client']
  setDeactivatedItems(items: number[]): void
  setDeactivatedExaminees(examinees: number[]): void
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({ client }) => {
  const { selectedVisualization } = useVisualization()
  const questType = client.getQuestType() as QuestType

  if (!selectedVisualization) {
    return <div>No visualization selected</div>
  }

  const VisualizationComponent = selectedVisualization[questType]

  if (!VisualizationComponent) {
    return <div>No visualization available for this quest type</div>
  }

  return <VisualizationComponent client={client} />
}

export default VisualizationRenderer
