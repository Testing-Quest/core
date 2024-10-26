import type { RenderResult } from '@testing-library/react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../../src/infrastructure/react/App'
import '@testing-library/jest-dom'
import { Client } from '../../../src/infrastructure/Client'
import { act } from 'react'

jest.mock('../../../src/infrastructure/react/context/useSettings.ts', () => ({
  useSettings: jest.fn(() => ({
    fontSize: '16px',
    highContrast: false,
    setFontSize: jest.fn(),
    setHighContrast: jest.fn(),
  })),
}))
jest.mock('../../../src/infrastructure/Client')
jest.mock('../../../src/infrastructure/react/tabs/analysis/AnalysisTab')
jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }))

// Constants
const UPLOAD_TAB = 'Upload'
const EXAMPLES_TAB = 'Examples'
const EXAMPLE_QUEST_1 = 'Example Quest 1'
const EXAMPLE_QUEST_2 = 'Example Quest 2'
const TEST_FILE_NAME = 'test.xlsx'

const createMockQuest = (name: string, scale: number, type: string, users: number, items: number) => ({
  name,
  quests: [{ scale, type, users, items }],
})

const renderApp = async (): Promise<RenderResult> => {
  let result: RenderResult
  await act(async () => {
    result = render(<App />)
  })
  return result!
}

const uploadFile = async (result: RenderResult, fileName: string) => {
  const file = new File(['dummy content'], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  file.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))

  await act(async () => {
    fireEvent.click(result.getByText(UPLOAD_TAB))
  })

  await act(async () => {
    const input = await result.findByTestId('file-input')
    userEvent.upload(input, file)
  })

  await waitFor(() => {
    expect(result.getByText(fileName)).toBeInTheDocument()
  })

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}

const selectExampleQuest = async (result: RenderResult, questName: string, questDetails: string) => {
  await act(async () => {
    fireEvent.click(result.getByText(questName))
  })

  await waitFor(() => {
    expect(result.getByText(questDetails)).toBeInTheDocument()
  })

  await act(async () => {
    fireEvent.click(result.getByText(questDetails))
  })
}

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render Upload and Examples tabs', async () => {
    const result = await renderApp()

    await waitFor(() => {
      expect(result.getByText(UPLOAD_TAB)).toBeInTheDocument()
      expect(result.getByText(EXAMPLES_TAB)).toBeInTheDocument()
    })
  })

  describe('Example Quests', () => {
    const mockQuests = [
      createMockQuest(EXAMPLE_QUEST_1, 5, 'multi', 10, 20),
      createMockQuest(EXAMPLE_QUEST_2, 7, 'gradu', 15, 25),
    ]

    beforeEach(() => {
      ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)
    })

    it('loads example quests on mount', async () => {
      const result = await renderApp()

      await waitFor(() => {
        expect(result.getByText(EXAMPLE_QUEST_1)).toBeInTheDocument()
        expect(result.getByText(EXAMPLE_QUEST_2)).toBeInTheDocument()
      })
    })

    it('adds a new analysis tab when an example quest is selected', async () => {
      ;(Client.createQuestfromMetadata as jest.Mock).mockResolvedValue({
        childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi' }],
      })

      const result = await renderApp()

      await selectExampleQuest(result, EXAMPLE_QUEST_1, 'Scale: 5 | Type: multi | Users: 10 | Items: 20')

      await waitFor(() => {
        expect(result.getByText('Example Quest 1 - scale: 5')).toBeInTheDocument()
      })
    })
  })

  describe('File Upload', () => {
    beforeEach(() => {
      Client.createQuest = jest.fn().mockResolvedValue({
        childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi', users: 10, items: 20 }],
      })
    })

    it('uploads a file and adds it to the list', async () => {
      const result = await renderApp()
      await uploadFile(result, TEST_FILE_NAME)

      expect(result.getByText(TEST_FILE_NAME)).toBeInTheDocument()
    })

    it('adds a new analysis tab when an uploaded quest is selected', async () => {
      const result = await renderApp()
      await uploadFile(result, TEST_FILE_NAME)

      await selectExampleQuest(result, TEST_FILE_NAME, 'Scale: 5 | Type: multi | Users: 10 | Items: 20')

      await waitFor(() => {
        expect(result.getByText(`${TEST_FILE_NAME} - scale: 5`)).toBeInTheDocument()
      })
    })
  })

  it('removes a dynamic tab when close button is clicked', async () => {
    const mockQuests = [createMockQuest('Example Quest', 5, 'multi', 10, 20)]
    ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)
    ;(Client.createQuestfromMetadata as jest.Mock).mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi' }],
    })

    const result = await renderApp()

    await selectExampleQuest(result, 'Example Quest', 'Scale: 5 | Type: multi | Users: 10 | Items: 20')

    await waitFor(() => {
      expect(result.getByText('Example Quest - scale: 5')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(result.getByLabelText('close'))
    })

    await waitFor(() => {
      expect(result.queryByText('Example Quest - scale: 5')).not.toBeInTheDocument()
    })
  })
})
