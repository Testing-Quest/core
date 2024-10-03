import React from 'react'
import type { Client } from '../../../../../Client'

type PanelProps = {
  client: Client
}

export const HealthMulti: React.FC<PanelProps> = ({ client }) => {
  // Renderiza el contenido del panel en función de la opción seleccionada

  return (
    <div className='health-multi-panel'>
      <div className='health-multi-section'>
        <h3>Descriptive Statistics</h3>
        <p>Type: {client.getQuestType()}</p>
        <p>Name: {client.getQuestName()}</p>
        <p>Scale: {client.getQuestScale()}</p>
      </div>
    </div>
  )
}
