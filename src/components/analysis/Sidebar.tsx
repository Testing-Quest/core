import React from 'react';
import { VisualizationItem } from './Analysis';

interface SidebarProps {
  name: string;
  onSidebarClick: (option: VisualizationItem) => void;
  sidebarOptions: VisualizationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ name, onSidebarClick, sidebarOptions }) => {

  return (
    <div>
      <h1>{name}</h1>
      {sidebarOptions.map((option) => (
        <button onClick={() => onSidebarClick(option)}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
