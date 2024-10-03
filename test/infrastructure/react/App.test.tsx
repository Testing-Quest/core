import { render, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../../src/infrastructure/react/App'
import '@testing-library/jest-dom'
import { Client } from '../../../src/infrastructure/Client'
import { act } from 'react'

jest.mock('../../../src/infrastructure/react/context/SettingContext', () => ({
  useSettings: jest.fn(() => ({
    fontSize: '16px',
    highContrast: false,
    setFontSize: jest.fn(),
    setHighContrast: jest.fn(),
  })),
}))

jest.mock('../../../src/infrastructure/react/App.module.css', () => ({
  appLayout: 'appLayout',
  appContent: 'appContent',
  tabsContainer: 'tabsContainer',
  tabPane: 'tabPane',
  dynamicTab: 'dynamicTab',
  tabIcon: 'tabIcon',
}))

jest.mock('../../../src/infrastructure/Client', () => ({
  Client: {
    getMetadata: jest.fn(async () => Promise.resolve([])),
  },
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

jest.mock('antd', () => {
  const antd = jest.requireActual('antd')

  const MockSpin: typeof antd.Spin = (props: any) => {
    const { children } = props as { children?: React.ReactNode }
    return <>{children ?? null}</>
  }

  return {
    ...antd,
    Spin: MockSpin,
  }
})

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}))

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render Upload and Examples tabs', async () => {
    const result = render(<App />)

    await waitFor(
      () => {
        expect(result.getByText('Upload')).toBeInTheDocument()
        expect(result.getByText('Examples')).toBeInTheDocument()
      },
      { timeout: 1000 },
    )
  })

  it('loads example quests on mount', async () => {
    const mockQuests = [
      { name: 'Example Quest 1', quests: [{ scale: 5, type: 'multi', users: 10, items: 20 }] },
      { name: 'Example Quest 2', quests: [{ scale: 7, type: 'gradu', users: 15, items: 25 }] },
    ]
    ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)

    const result = render(<App />)

    await waitFor(() => {
      expect(result.getByText('Example Quest 1')).toBeInTheDocument()
      expect(result.getByText('Example Quest 2')).toBeInTheDocument()
    })
  })

  it('adds a new analysis tab when an example quest is selected', async () => {
    const mockQuests = [{ name: 'Example Quest', quests: [{ scale: 1, type: 'multi', users: 10, items: 20 }] }]
    ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)
    Client.createQuestfromMetadata = jest.fn().mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 1, type: 'multi' }],
    })

    const result = render(<App />)

    await waitFor(() => {
      expect(result.getByText('Example Quest')).toBeInTheDocument()
    })

    fireEvent.click(result.getByText('Example Quest'))

    fireEvent.click(result.getByText('Scale: 1 | Type: multi | Users: 10 | Items: 20'))

    await waitFor(() => {
      expect(result.getByText('Example Quest - scale: 1')).toBeInTheDocument()
    })
  })

  it('uploads a file and adds it to the list', async () => {
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    file.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))

    Client.createQuest = jest.fn().mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi', users: 10, items: 20 }],
    })

    const result = render(<App />)

    fireEvent.click(result.getByText('Upload'))

    const input = await result.findByTestId('file-input')

    act(() => {
      userEvent.upload(input, file)
    })

    await waitFor(() => {
      expect(result.getByText('test.xlsx')).toBeInTheDocument()
    })
  })

  it('adds a new analysis tab when an uploaded quest is selected', async () => {
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    file.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))

    Client.createQuest = jest.fn().mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi', users: 10, items: 20 }],
    })

    const result = render(<App />)

    fireEvent.click(result.getByText('Upload'))

    const input = await result.findByTestId('file-input')

    act(() => {
      userEvent.upload(input, file)
    })

    await waitFor(() => {
      expect(result.getByText('test.xlsx')).toBeInTheDocument()
    })

    fireEvent.click(result.getByText('test.xlsx'))

    fireEvent.click(result.getByText('Scale: 5 | Type: multi | Users: 10 | Items: 20'))

    await waitFor(() => {
      expect(result.getByText('test.xlsx - scale: 5')).toBeInTheDocument()
    })
  })

  it('removes a dynamic tab when close button is clicked', async () => {
    const mockQuests = [{ name: 'Example Quest', quests: [{ scale: 5, type: 'multi', users: 10, items: 20 }] }]
    ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)
    Client.createQuestfromMetadata = jest.fn().mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi' }],
    })

    const result = render(<App />)

    await waitFor(() => {
      fireEvent.click(result.getByText('Example Quest'))
    })
    fireEvent.click(result.getByText('Scale: 5 | Type: multi | Users: 10 | Items: 20'))

    await waitFor(() => {
      expect(result.getByText('Example Quest - scale: 5')).toBeInTheDocument()
    })

    fireEvent.click(result.getByLabelText('close'))

    await waitFor(() => {
      expect(result.queryByText('Example Quest - scale: 5')).not.toBeInTheDocument()
    })
  })
})
