import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSettings } from '../../../../../../src/infrastructure/react/context/useSettings'
import { DirectBlank } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/DirectBlank'
import { getCorrelation } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/getCorrelation'
import { Client } from '../../../../../../src/infrastructure/Client'

// Mock all external dependencies
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid='scatter-chart'>{children}</div>,
  CartesianGrid: () => <div data-testid='cartesian-grid'>Grid</div>,
  XAxis: ({ children }: { children: React.ReactNode }) => <div data-testid='x-axis'>{children}</div>,
  YAxis: ({ children }: { children: React.ReactNode }) => <div data-testid='y-axis'>{children}</div>,
  ZAxis: () => <div data-testid='z-axis'>ZAxis</div>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Scatter: ({ data, name }: { data: any[]; name: string }) => (
    <div data-testid={`scatter-${name}`}>Points: {data.length}</div>
  ),
  Tooltip: ({ content }: { content: React.ReactNode }) => <div data-testid='tooltip'>{content}</div>,
  Label: ({ value }: { value: string }) => <div data-testid='axis-label'>{value}</div>,
  LabelList: () => <div data-testid='label-list'>Labels</div>,
  Text: () => <div data-testid='text'>Text</div>,
}))

jest.mock('../../../../../../src/infrastructure/react/context/useSettings')
jest.mock('antd', () => ({
  Spin: ({ tip }: { tip: string }) => <div data-testid='spinner'>{tip}</div>,
  Input: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Search: ({ onSearch, onClear, placeholder }: any) => (
      <div data-testid='search-input'>
        <input placeholder={placeholder} onChange={(e: any) => onSearch(e.target.value)} data-testid='search-field' />
        <button onClick={onClear} data-testid='clear-button'>
          Clear
        </button>
      </div>
    ),
  },
}))

describe('DirectBlank Component', () => {
  const mockData = [
    { x: 1, y: 2, hover: 1 },
    { x: 2, y: 3, hover: 2 },
    { x: 3, y: 4, hover: 3 },
  ]

  const mockClient = {
    getDirectBlankData: jest.fn().mockResolvedValue({ data: mockData }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: '14px' })
  })

  it('shows loading state initially', () => {
    render(<DirectBlank client={mockClient as unknown as Client} />)
    expect(screen.getByTestId('spinner')).toHaveTextContent('Loading health data...')
  })

  it('fetches and displays data correctly', async () => {
    render(<DirectBlank client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(mockClient.getDirectBlankData).toHaveBeenCalled()
    expect(screen.getByTestId('scatter-Users')).toHaveTextContent('Points: 3')
  })

  it('handles search functionality correctly', async () => {
    render(<DirectBlank client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByTestId('search-field')
    fireEvent.change(searchInput, { target: { value: '2' } })

    expect(screen.getByTestId('scatter-Highlighted User')).toHaveTextContent('Points: 1')
  })

  it('handles clear search correctly', async () => {
    render(<DirectBlank client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByTestId('search-field')
    fireEvent.change(searchInput, { target: { value: '2' } })

    const clearButton = screen.getByTestId('clear-button')
    fireEvent.click(clearButton)

    expect(screen.getByTestId('scatter-Highlighted User')).toHaveTextContent('Points: 0')
  })

  it('displays correct axis labels', async () => {
    render(<DirectBlank client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const axisLabels = screen.getAllByTestId('axis-label')
    expect(axisLabels[0]).toHaveTextContent('Direct Score')
    expect(axisLabels[1]).toHaveTextContent('Blank Answer')
  })

  it('shows correlation value', async () => {
    render(<DirectBlank client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const correlation = getCorrelation(mockData)
    expect(screen.getByText(`Correlation: ${correlation}`)).toBeInTheDocument()
  })

  it('handles error in data fetching', async () => {
    const errorClient = {
      getDirectBlankData: jest.fn().mockRejectedValue(new Error('Fetch error')),
    }

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    render(<DirectBlank client={errorClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  describe('CustomTooltip', () => {
    it('renders tooltip content correctly when active', async () => {
      render(<DirectBlank client={mockClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      const CustomTooltip = screen.getByTestId('tooltip')
      expect(CustomTooltip).toBeInTheDocument()
    })
  })
})
