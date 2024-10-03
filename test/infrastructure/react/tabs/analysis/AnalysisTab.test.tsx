import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar from '../../../../../src/infrastructure/react/tabs/analysis/Sidebar'
import { VisualizationProvider } from '../../../../../src/infrastructure/react/tabs/analysis/VisualizationContext'

jest.mock('antd', () => ({
  Menu: ({ children, items, selectedKeys, onClick, ...props }: any) => {
    return (
      <div data-testid='mock-menu' {...props}>
        {items.map((item: any) => (
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
}))

jest.mock('../../../../../src/infrastructure/react/context/SettingContext', () => ({
  useSettings: jest.fn(() => ({
    fontSize: '16px',
    highContrast: false,
    setFontSize: jest.fn(),
    setHighContrast: jest.fn(),
  })),
}))

describe('Sidebar', () => {
  const mockVisualizations = [
    { label: 'Option 1', icon: 'basic', multi: jest.fn(), gradu: null, binary: null },
    { label: 'Option 2', icon: 'plot', multi: jest.fn(), gradu: null, binary: null },
    { label: 'Option 3', icon: 'table', multi: jest.fn(), gradu: null, binary: null },
  ]

  const renderWithContext = (component: React.ReactElement) => {
    return render(
      <VisualizationProvider initialVisualization={mockVisualizations[0]}>{component}</VisualizationProvider>,
    )
  }

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
})
