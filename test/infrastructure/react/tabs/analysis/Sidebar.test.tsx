import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar from '../../../../../src/infrastructure/react/tabs/analysis/SideBar'

jest.mock('../../../../../src/infrastructure/react/tabs/analysis/Sidebar.module.css', () => ({
  sidebar: 'sidebar',
  logo: 'logo',
  menu: 'menu',
}))

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

describe('Sidebar', () => {
  const mockOnSidebarClick = jest.fn()
  const mockSidebarOptions = [
    { label: 'Option 1', icon: 'basic', component: () => null, questId: '1' },
    { label: 'Option 2', icon: 'plot', component: () => null, questId: '2' },
    { label: 'Option 3', icon: 'table', component: () => null, questId: '3' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the sidebar with logo and menu', () => {
    const result = render(<Sidebar onSidebarClick={mockOnSidebarClick} sidebarOptions={mockSidebarOptions} />)

    expect(result.getByAltText('Testing Quest')).toBeInTheDocument()
    expect(result.getByTestId('mock-menu')).toBeInTheDocument()
  })

  it('renders all sidebar options', () => {
    const result = render(<Sidebar onSidebarClick={mockOnSidebarClick} sidebarOptions={mockSidebarOptions} />)

    mockSidebarOptions.forEach(option => {
      expect(result.getByTestId(`menu-item-${option.label}`)).toBeInTheDocument()
    })
  })

  it('selects the first option by default', () => {
    const result = render(<Sidebar onSidebarClick={mockOnSidebarClick} sidebarOptions={mockSidebarOptions} />)

    const firstMenuItem = result.getByTestId('menu-item-Option 1')
    expect(firstMenuItem).toHaveStyle('background-color: #e6f7ff')
  })

  it('calls onSidebarClick with the correct option when a menu item is clicked', () => {
    const result = render(<Sidebar onSidebarClick={mockOnSidebarClick} sidebarOptions={mockSidebarOptions} />)

    fireEvent.click(result.getByTestId('menu-item-Option 2'))

    expect(mockOnSidebarClick).toHaveBeenCalledWith(mockSidebarOptions[1])
  })

  it('updates selectedKeys when a new option is selected', () => {
    const result = render(<Sidebar onSidebarClick={mockOnSidebarClick} sidebarOptions={mockSidebarOptions} />)

    fireEvent.click(result.getByTestId('menu-item-Option 3'))

    const selectedMenuItem = result.getByTestId('menu-item-Option 3')
    expect(selectedMenuItem).toHaveStyle('background-color: #e6f7ff')
  })
})
