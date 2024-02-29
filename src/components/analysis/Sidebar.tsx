import React, { useState, useEffect } from 'react';
import { VisualizationItem } from './Analysis';
import {
  LineChartOutlined,
  TableOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Menu } from 'antd';

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


  return (
    <div style={{ width: '14%', maxWidth: '260px' }}>
      <Menu mode="vertical" theme="light" selectedKeys={[selectedKey || '']}>
        <img src="/tqLogo.jpeg" alt="Testing Quest" style={{ width: '80%', height: 'auto' }} />

        <Dropdown
          menu={{ items }}
          placement="bottom"
        >
          <Button
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 'calc(100% - 8px)',
              paddingBlock: '18px',
              marginBottom: '18px',
              marginLeft: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 'calc(100% - 24px)',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {name}
              </span>
            </div>
            <div>
              <DownOutlined />
            </div>
          </Button>
        </Dropdown>

        {sidebarOptions.map((option) => (
          <Menu.Item key={option.label} icon={getIcon(option.type)} onClick={() => handleClick(option)}>
            {option.label}
          </Menu.Item>
        ))}
      </Menu>
    </div >
  );

};

export default Sidebar;
