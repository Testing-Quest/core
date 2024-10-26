import React, { useState, useEffect } from 'react'
import { Menu, Tooltip, Divider } from 'antd'
import type { MenuProps } from 'antd'
import { LineChartOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons'
import { AnalysisVisualization } from './types'
import styles from './AnalysisTab.module.css'
import { useSettings } from '../../context/useSettings'
import { useVisualization } from './context/useVisualization'

const iconMap = {
  basic: AppstoreOutlined,
  plot: LineChartOutlined,
  table: TableOutlined,
}

type SidebarProps = {
  visualizations: AnalysisVisualization[]
}

export const Sidebar: React.FC<SidebarProps> = ({ visualizations }) => {
  const { selectedVisualization, setSelectedVisualization } = useVisualization()
  const { fontSize } = useSettings()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      label: (
        <Tooltip title={option.label} placement='right'>
          <span className={styles['menu-item-label']}>
            {windowWidth < 768 ? option.label.slice(0, 3) + (option.label.length > 3 ? '...' : '') : option.label}
          </span>
        </Tooltip>
      ),
    }
  })

  return (
    <div className={styles.sidebar}>
      <div className={styles['logo-container']}>
        <img src='/tqLogo.jpeg' alt='Testing Quest' className={styles.logo} />
      </div>
      <Divider style={{ margin: '0' }} />
      <Menu
        mode='inline'
        theme='light'
        selectedKeys={[selectedVisualization?.label || '']}
        onClick={handleClick}
        items={menuItems}
        style={{ fontSize }}
      />
    </div>
  )
}
