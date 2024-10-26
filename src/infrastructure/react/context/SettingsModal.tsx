import React from 'react'
import { Modal, Slider, Switch } from 'antd'
import { useSettings } from './useSettings'

type SettingsModalProps = {
  isVisible: boolean
  onClose(): void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
  const { fontSize, highContrast, setFontSize, setHighContrast } = useSettings()

  return (
    <Modal title='Settings' open={isVisible} onCancel={onClose} footer={null}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ marginRight: '8px' }}>Font Size:</label>
        <Slider
          min={12}
          max={25}
          onChange={value => {
            setFontSize(`${value}px`)
          }}
          value={Number(fontSize.split('px')[0]) || 16}
          tooltip={{ formatter: value => `${value}px` }}
        />
      </div>
      <div>
        <label style={{ marginRight: '8px' }}>High Contrast:</label>
        <Switch checked={highContrast} onChange={setHighContrast} />
      </div>
    </Modal>
  )
}

export default SettingsModal
