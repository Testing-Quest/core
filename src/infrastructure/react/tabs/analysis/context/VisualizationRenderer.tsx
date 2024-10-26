import React, { useEffect, useState } from 'react'
import type { VisualizationComponentProps, QuestType } from '../types'
import { useVisualization } from './useVisualization'

type VisualizationRendererProps = {
  client: VisualizationComponentProps['client']
  setDeactivatedItems(items: number[]): void
  setDeactivatedExaminees(examinees: number[]): void
  updateTrigger: number // Nuevo prop
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  client,
  setDeactivatedExaminees,
  setDeactivatedItems,
  updateTrigger,
}) => {
  const { selectedVisualization } = useVisualization()
  const questType = client.getQuestType() as QuestType
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Forzar re-render cuando updateTrigger cambie
    setKey(prevKey => prevKey + 1)
  }, [updateTrigger])

  if (!selectedVisualization) {
    return <div>No visualization selected</div>
  }

  const VisualizationComponent = selectedVisualization[questType]

  if (!VisualizationComponent) {
    return <div>No visualization available for this quest type</div>
  }

  return (
    <VisualizationComponent
      key={key} // Usar key para forzar re-render
      client={client}
      setDeactivatedItems={setDeactivatedItems}
      setDeactivatedExaminees={setDeactivatedExaminees}
    />
  )
}

export default VisualizationRenderer
