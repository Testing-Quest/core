import React from 'react';
import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from './GlobalState';

const Navbar: React.FC = () => {
  const { analysisQuests } = useGlobalState();
  const navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate(key);
  };

  const tabsItems = [
    { label: 'Examples', key: '/examples' },
    { label: 'Upload', key: '/upload' },
    ...(analysisQuests.length !== 0 || window.location.pathname === "/analysis" ? [{ label: 'Analysis', key: '/analysis' }] : []),
  ];

  return (
    <Tabs activeKey={window.location.pathname} onChange={handleTabChange} items={tabsItems} />
  );
};

export default Navbar;
