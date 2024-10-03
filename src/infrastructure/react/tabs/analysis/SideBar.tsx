import React, { useState } from 'react'
import { LineChartOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import styles from './Sidebar.module.css'

type VisualizationItem = {
  label: string
  icon: string
  component: React.ComponentType<any>
  questId: string
}

type SidebarProps = {
  onSidebarClick(option: VisualizationItem): void
  sidebarOptions: VisualizationItem[]
}

const iconMap = {
  basic: AppstoreOutlined,
  plot: LineChartOutlined,
  table: TableOutlined,
}

const Sidebar: React.FC<SidebarProps> = ({ onSidebarClick, sidebarOptions }) => {
  const [selectedKey, setSelectedKey] = useState(sidebarOptions[0].label)

  const handleClick: MenuProps['onClick'] = e => {
    const option = sidebarOptions.find(opt => opt.label === e.key)
    if (option) {
      setSelectedKey(option.label)
      onSidebarClick(option)
    }
  }

  const menuItems: MenuProps['items'] = sidebarOptions.map(option => {
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
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        items={menuItems}
        className={styles.menu}
      />
    </div>
  )
}

export default Sidebar
