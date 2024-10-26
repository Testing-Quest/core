import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Sidebar } from '../../../../../src/infrastructure/react/tabs/analysis/Sidebar'
import { VisualizationProvider } from '../../../../../src/infrastructure/react/tabs/analysis/context/VisualizationContext'

jest.mock('antd', () => ({
  Menu: ({
    items,
    selectedKeys,
    onClick,
    ...props
  }: {
    items: Array<{ key: string; icon: React.ReactNode; label: React.ReactNode }>
    selectedKeys: string[]
    onClick(event: { key: string }): void
  }) => {
    return (
      <div data-testid='mock-menu' {...props}>
        {items.map(item => (
          <div
            key={item.key}
            data-testid={`menu-item-${item.key}`}
            onClick={() => onClick({ key: item.key })}
            style={{ backgroundColor: selectedKeys.includes(item.key) ? '#e6f7ff' : 'transparent' }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
    )
  },
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
  Divider: () => <div data-testid='divider' />,
}))

jest.mock('@ant-design/icons', () => ({
  LineChartOutlined: () => <div>LineChartIcon</div>,
  TableOutlined: () => <div>TableIcon</div>,
  AppstoreOutlined: () => <div>AppstoreIcon</div>,
}))

jest.mock('../../../../../src/infrastructure/react/context/useSettings', () => ({
  useSettings: () => ({
    fontSize: '16px',
    highContrast: false,
    setFontSize: jest.fn(),
    setHighContrast: jest.fn(),
  }),
}))

const mockResizeListener = jest.fn()
window.addEventListener = jest.fn(event => {
  if (event === 'resize') mockResizeListener()
})
window.removeEventListener = jest.fn()

describe('Sidebar', () => {
  const DummyComponent = () => <div>Dummy Component</div>

  const mockVisualizations = [
    {
      label: 'Option 1',
      icon: 'basic',
      multi: DummyComponent,
      gradu: DummyComponent,
      binary: DummyComponent,
    },
    {
      label: 'Option 2',
      icon: 'plot',
      multi: DummyComponent,
      gradu: DummyComponent,
      binary: DummyComponent,
    },
    {
      label: 'Option 3',
      icon: 'table',
      multi: DummyComponent,
      gradu: DummyComponent,
      binary: DummyComponent,
    },
  ]

  const renderWithContext = (component: React.ReactElement) => {
    return render(
      <VisualizationProvider initialVisualization={mockVisualizations[0]}>{component}</VisualizationProvider>,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    window.innerWidth = 1024 // Set a default window width
  })

  it('renders the sidebar with logo and menu', () => {
    const { getByAltText, getByTestId } = renderWithContext(<Sidebar visualizations={mockVisualizations} />)
    expect(getByAltText('Testing Quest')).toBeInTheDocument()
    expect(getByTestId('mock-menu')).toBeInTheDocument()
  })

  it('renders all sidebar options', () => {
    const { getByTestId } = renderWithContext(<Sidebar visualizations={mockVisualizations} />)
    mockVisualizations.forEach(option => {
      expect(getByTestId(`menu-item-${option.label}`)).toBeInTheDocument()
    })
  })

  it('selects the first option by default', () => {
    const { getByTestId } = renderWithContext(<Sidebar visualizations={mockVisualizations} />)
    const firstMenuItem = getByTestId('menu-item-Option 1')
    expect(firstMenuItem).toHaveStyle('background-color: #e6f7ff')
  })

  it('updates selected item when a new option is clicked', () => {
    const { getByTestId } = renderWithContext(<Sidebar visualizations={mockVisualizations} />)
    fireEvent.click(getByTestId('menu-item-Option 2'))
    expect(getByTestId('menu-item-Option 2')).toHaveStyle('background-color: #e6f7ff')
    expect(getByTestId('menu-item-Option 1')).toHaveStyle('background-color: transparent')
  })

  it('handles window resize', () => {
    renderWithContext(<Sidebar visualizations={mockVisualizations} />)
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('removes resize listener on unmount', () => {
    const { unmount } = renderWithContext(<Sidebar visualizations={mockVisualizations} />)
    unmount()
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
