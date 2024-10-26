import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSettings } from '../../../../../../src/infrastructure/react/context/useSettings'
import { DirectMci } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/DirectMci'
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
    <div data-testid={`scatter-${name.replace(/\s+/g, '-')}`}>Points: {data.length}</div>
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

describe('DirectMci Component', () => {
  const mockData = [
    { x: 1, y: 0.6, hover: 1 },
    { x: 2, y: 0.8, hover: 2 },
    { x: 3, y: 0.7, hover: 3 },
  ]

  const mockClient = {
    getDirectMciData: jest.fn().mockResolvedValue({ data: mockData }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: '14px' })
  })

  it('shows loading state initially', () => {
    render(<DirectMci client={mockClient as unknown as Client} />)
    expect(screen.getByTestId('spinner')).toHaveTextContent('Loading health data...')
  })

  it('fetches and displays data correctly', async () => {
    render(<DirectMci client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(mockClient.getDirectMciData).toHaveBeenCalled()
    expect(screen.getByTestId('scatter-Examinees')).toHaveTextContent('Points: 3')
  })

  it('handles search functionality correctly', async () => {
    render(<DirectMci client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByTestId('search-field')
    fireEvent.change(searchInput, { target: { value: '2' } })

    expect(screen.getByTestId('scatter-Highlighted-Examinee')).toHaveTextContent('Points: 1')
  })

  it('handles clear search correctly', async () => {
    render(<DirectMci client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByTestId('search-field')
    fireEvent.change(searchInput, { target: { value: '2' } })

    const clearButton = screen.getByTestId('clear-button')
    fireEvent.click(clearButton)

    expect(screen.getByTestId('scatter-Highlighted-Examinee')).toHaveTextContent('Points: 0')
  })

  it('displays correct axis labels', async () => {
    render(<DirectMci client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const axisLabels = screen.getAllByTestId('axis-label')
    expect(axisLabels[0]).toHaveTextContent('Direct Score')
    expect(axisLabels[1]).toHaveTextContent('MCI')
  })

  it('shows correlation value', async () => {
    render(<DirectMci client={mockClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    const correlation = getCorrelation(mockData)
    expect(screen.getByText(`Correlation: ${correlation}`)).toBeInTheDocument()
  })

  it('handles error in data fetching', async () => {
    const errorClient = {
      getDirectMciData: jest.fn().mockRejectedValue(new Error('Fetch error')),
    }

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    render(<DirectMci client={errorClient as unknown as Client} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  describe('Chart Interactions', () => {
    it('highlights selected examinee correctly', async () => {
      render(<DirectMci client={mockClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByTestId('search-field')
      fireEvent.change(searchInput, { target: { value: '2' } })

      const highlightedPoints = screen.getByTestId('scatter-Highlighted-Examinee')
      expect(highlightedPoints).toHaveTextContent('Points: 1')
    })

    it('handles invalid search input', async () => {
      render(<DirectMci client={mockClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByTestId('search-field')
      fireEvent.change(searchInput, { target: { value: 'invalid' } })

      expect(screen.getByTestId('scatter-Highlighted-Examinee')).toHaveTextContent('Points: 0')
    })
  })

  describe('Chart Layout', () => {
    it('uses correct dimensions', async () => {
      const { container } = render(<DirectMci client={mockClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      const chartContainer = container.querySelector('div[style*="height: 600px"]')
      expect(chartContainer).toBeInTheDocument()
    })

    it('includes all required chart elements', async () => {
      render(<DirectMci client={mockClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('z-axis')).toBeInTheDocument()
      expect(screen.getByTestId('scatter-Examinees')).toBeInTheDocument()
    })
  })
})
