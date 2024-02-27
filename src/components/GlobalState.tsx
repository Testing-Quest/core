import React, { createContext, useContext, useState, ReactNode } from 'react';
import { questGradu } from '../domain/quests/questGradu';
import { questMulti } from '../domain/quests/questMulti';
import { QuestData } from '../application/dtos/questDtos';

interface AnalysisQuest {
  id: string;
  name: string;
  quest: questGradu | questMulti;
}

export interface UploadedQuest {
  id: string;
  name: string;
  quests: QuestData[];
}

interface GlobalState {
  analysisQuests: AnalysisQuest[];
  uploadedQuests: UploadedQuest[];
  addAnalysisQuest: (quest: AnalysisQuest) => void;
  addUploadedQuest: (quest: UploadedQuest) => void;
  removeAnalysisQuest: (questId: string) => void;
  removeUploadedQuest: (questId: string) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [analysisQuests, setAnalysisQuests] = useState<AnalysisQuest[]>([]);
  const [uploadedQuests, setUploadedQuests] = useState<UploadedQuest[]>([]);

  const addUploadedQuest = (quest: UploadedQuest) => {
    const existingQuest = uploadedQuests.find((q) => q.id === quest.id);

    if (existingQuest) {
      console.log('El Quest ya existe');
    } else {
      setUploadedQuests((prevQuests) => [...prevQuests, quest]);
    }
  };

  const removeUploadedQuest = (questId: string) => {
    setUploadedQuests((prevQuests) => prevQuests.filter((q) => q.id !== questId));
  }

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
    setAnalysisQuests((prevQuests) => prevQuests.filter((q) => q.id.split("-")[0] !== questId));
  }

  return (
    <GlobalStateContext.Provider value={{ 
      analysisQuests,
      uploadedQuests,
      addAnalysisQuest,
      addUploadedQuest,
      removeAnalysisQuest,
      removeUploadedQuest
    }}>
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

