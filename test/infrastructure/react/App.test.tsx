import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../../src/infrastructure/react/App'
import '@testing-library/jest-dom'
import { Client } from '../../../src/infrastructure/Client'

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
    render(<App />)

    await waitFor(
      () => {
        expect(screen.getByText('Upload')).toBeInTheDocument()
        expect(screen.getByText('Examples')).toBeInTheDocument()
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

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Example Quest 1')).toBeInTheDocument()
      expect(screen.getByText('Example Quest 2')).toBeInTheDocument()
    })
  })

  it('adds a new analysis tab when an example quest is selected', async () => {
    const mockQuests = [{ name: 'Example Quest', quests: [{ scale: 1, type: 'multi', users: 10, items: 20 }] }]
    ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)
    Client.createQuestfromMetadata = jest.fn().mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 1, type: 'multi' }],
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Example Quest')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Example Quest'))

    fireEvent.click(screen.getByText('Scale: 1 | Type: multi | Users: 10 | Items: 20'))

    await waitFor(() => {
      expect(screen.getByText('Example Quest - scale: 1')).toBeInTheDocument()
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

    render(<App />)

    fireEvent.click(screen.getByText('Upload'))

    const input = await screen.findByTestId('file-input')

    await waitFor(() => {
      // Upload the file
      userEvent.upload(input, file)
      expect(screen.getByText('test.xlsx')).toBeInTheDocument()
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

    render(<App />)

    fireEvent.click(screen.getByText('Upload'))

    const input = await screen.findByTestId('file-input')

    await waitFor(() => {
      // Upload the file
      userEvent.upload(input, file)
      expect(screen.getByText('test.xlsx')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('test.xlsx'))

    fireEvent.click(screen.getByText('Scale: 5 | Type: multi | Users: 10 | Items: 20'))

    await waitFor(() => {
      expect(screen.getByText('test.xlsx - scale: 5')).toBeInTheDocument()
    })
  })

  it('removes a dynamic tab when close button is clicked', async () => {
    const mockQuests = [{ name: 'Example Quest', quests: [{ scale: 5, type: 'multi', users: 10, items: 20 }] }]
    ;(Client.getMetadata as jest.Mock).mockResolvedValue(mockQuests)
    Client.createQuestfromMetadata = jest.fn().mockResolvedValue({
      childs: [{ uuid: 'mocked-uuid', scale: 5, type: 'multi' }],
    })

    render(<App />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Example Quest'))
    })
    fireEvent.click(screen.getByText('Scale: 5 | Type: multi | Users: 10 | Items: 20'))

    await waitFor(() => {
      expect(screen.getByText('Example Quest - scale: 5')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('close'))

    await waitFor(() => {
      expect(screen.queryByText('Example Quest - scale: 5')).not.toBeInTheDocument()
    })
  })
})
