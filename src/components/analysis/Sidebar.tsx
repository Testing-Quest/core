import React, { useState, useEffect } from 'react';
import { VisualizationItem } from './Analysis';
import {
  LineChartOutlined,
  TableOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Menu, Button } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { useGlobalState } from '../GlobalState';

interface SidebarProps {
  name: string;
  onSidebarClick: (option: VisualizationItem) => void;
  sidebarOptions: VisualizationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ name, onSidebarClick, sidebarOptions }) => {
  const { analysisQuests, addAnalysisQuest } = useGlobalState();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (sidebarOptions.length > 0 && selectedKey === null) {
      setSelectedKey(sidebarOptions[0].label);
    }
  }, [sidebarOptions, selectedKey]);

  const items: MenuProps['items'] = analysisQuests.map((quest) => ({
    key: quest.name,
    label: quest.name,
    onClick: () => {
      addAnalysisQuest(quest);
      const option: VisualizationItem = sidebarOptions.find((option) => option.label === "Health") || sidebarOptions[0];
      handleClick(option)
    }
  }));

  const handleClick = (option: VisualizationItem) => {
    setSelectedKey(option.label);
    onSidebarClick(option);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'basic':
        return <AppstoreOutlined />;
      case 'plot':
        return <LineChartOutlined />;
      case 'table':
        return <TableOutlined />;
      default:
        return <AppstoreOutlined />;
    }
  };
  
  // TODO: Fix this dropwdown button style
  return (
    <div style={{ width: 'calc(1/6 * 100vw - (1/24 * 100vw))' }}>

      <Dropdown menu={{ items }}>
        <Button style={{ width: 'calc(1/6 * 100vw - (1/24 * 100vw))', overflow: 'hidden'}}>
          <Space>
            <p style={{ maxWidth: 'calc(1/6 * 100vw - (1/24 * 100vw))', overflow: 'hidden', margin: 0}}>
              {name}
            </p>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>

      <br />
      <Menu mode="vertical" theme="light" selectedKeys={[selectedKey || '']}>
        <img src="/tqLogo.jpeg" alt="Testing Quest" style={{ width: 'calc(1/6 * 100vw - (1/15 * 100vw))', height: 'auto' }} />

        {sidebarOptions.map((option) => (
          <Menu.Item key={option.label} icon={getIcon(option.type)} onClick={() => handleClick(option)}>
            {option.label}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
