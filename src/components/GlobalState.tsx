import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisQuest {
  id: string;
  // ... Otras propiedades y métodos de Quest
}

interface GlobalState {
  analysisQuests: AnalysisQuest[];
  addAnalysisQuest: (quest: AnalysisQuest) => void;
  removeAnalysisQuest: (questId: string) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [analysisQuests, setAnalysisQuests] = useState<AnalysisQuest[]>([]);

  const addAnalysisQuest = (quest: AnalysisQuest) => {
    const existingQuest = analysisQuests.find((q) => q.id === quest.id);

    if (existingQuest) {
      console.log('El Quest ya existe');
    } else {
      setAnalysisQuests((prevQuests) => [...prevQuests, quest]);
    }
  };

  const removeAnalysisQuest = (questId: string) => {
    setAnalysisQuests((prevQuests) => prevQuests.filter((q) => q.id !== questId));
  }

  return (
    <GlobalStateContext.Provider value={{ analysisQuests, addAnalysisQuest, removeAnalysisQuest }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState debe ser utilizado dentro de GlobalStateProvider');
  }
  return context;
};

