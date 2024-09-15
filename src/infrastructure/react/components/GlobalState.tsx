import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react'
import type { questGradu } from '../domain/quests/questGradu'
import type { questMulti } from '../domain/quests/questMulti'
import type { QuestData, QuestType } from '../application/dtos/questDtos'

type AnalysisQuest = {
  id: string
  name: string
  quest: questGradu | questMulti // TODO: REFATOR: Bad code, infrastructe should not know about domain. Need to find a way to remove this dependency.
  type: (typeof QuestType)[keyof typeof QuestType]
}

export type UploadedQuest = {
  id: string
  name: string
  quests: QuestData[]
}

type GlobalState = {
  analysisQuests: AnalysisQuest[]
  uploadedQuests: UploadedQuest[]
  addAnalysisQuest(quest: AnalysisQuest): void
  addUploadedQuest(quest: UploadedQuest): void
  removeAnalysisQuest(questId: string): void
  removeUploadedQuest(questId: string): void
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined)

type GlobalStateProviderProps = {
  children: ReactNode
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [analysisQuests, setAnalysisQuests] = useState<AnalysisQuest[]>([])
  const [uploadedQuests, setUploadedQuests] = useState<UploadedQuest[]>([])

  const addUploadedQuest = (quest: UploadedQuest) => {
    setUploadedQuests(prevQuests => [quest, ...prevQuests])
  }

  const removeUploadedQuest = (questId: string) => {
    setUploadedQuests(prevQuests => prevQuests.filter(q => q.id !== questId))
  }

  const addAnalysisQuest = (quest: AnalysisQuest) => {
    const existingQuest = analysisQuests.find(q => q.id === quest.id)

    if (existingQuest) {
      setAnalysisQuests(prevQuests => [
        quest,
        ...prevQuests.filter(q => q.id !== quest.id),
      ])
    } else {
      setAnalysisQuests(prevQuests => [quest, ...prevQuests])
    }
  }

  const removeAnalysisQuest = (questId: string) => {
    setAnalysisQuests(prevQuests => prevQuests.filter(q => q.id !== questId))
    setAnalysisQuests(prevQuests =>
      prevQuests.filter(q => q.id.split('-')[0] !== questId),
    )
  }

  return (
    <GlobalStateContext.Provider
      value={{
        analysisQuests,
        uploadedQuests,
        addAnalysisQuest,
        addUploadedQuest,
        removeAnalysisQuest,
        removeUploadedQuest,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error(
      'useGlobalState debe ser utilizado dentro de GlobalStateProvider',
    )
  }
  return context
}
