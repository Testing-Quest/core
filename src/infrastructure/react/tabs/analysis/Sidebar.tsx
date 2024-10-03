import React from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { LineChartOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons'
import styles from './Sidebar.module.css'
import type { AnalysisVisualization } from './types'
import { useVisualization } from './VisualizationContext'
import { useSettings } from '../../context/SettingContext'

const iconMap = {
  basic: AppstoreOutlined,
  plot: LineChartOutlined,
  table: TableOutlined,
}

type SidebarProps = {
  visualizations: AnalysisVisualization[]
}

const Sidebar: React.FC<SidebarProps> = ({ visualizations }) => {
  const { selectedVisualization, setSelectedVisualization } = useVisualization()
  const { fontSize } = useSettings()

  const handleClick: MenuProps['onClick'] = e => {
    const option = visualizations.find(opt => opt.label === e.key)
    if (option) {
      setSelectedVisualization(option)
    }
  }

  const menuItems: MenuProps['items'] = visualizations.map(option => {
    const Icon = iconMap[option.icon as keyof typeof iconMap] || AppstoreOutlined
    return {
      key: option.label,
      icon: <Icon />,
      label: option.label,
    }
  })

  return (
    <div className={styles.sidebar}>
      <img src='/tqLogo.jpeg' alt='Testing Quest' className={styles.logo} />
      <Menu
        mode='vertical'
        theme='light'
        selectedKeys={[selectedVisualization?.label || '']}
        onClick={handleClick}
        items={menuItems}
        className={styles.menu}
        style={{ fontSize }}
      />
    </div>
  )
}

export default Sidebar
