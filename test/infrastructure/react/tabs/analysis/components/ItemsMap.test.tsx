import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSettings } from '../../../../../../src/infrastructure/react/context/useSettings'
import { ItemsMap } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/ItemsMap'
import { Client } from '../../../../../../src/infrastructure/Client'

// Mock all external dependencies
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid='scatter-chart'>{children}</div>,
  CartesianGrid: () => <div data-testid='cartesian-grid'>Grid</div>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  XAxis: ({ children, ticks, domain }: any) => (
    <div data-testid='x-axis' data-ticks={JSON.stringify(ticks)} data-domain={JSON.stringify(domain)}>
      {children}
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  YAxis: ({ children, ticks, domain }: any) => (
    <div data-testid='y-axis' data-ticks={JSON.stringify(ticks)} data-domain={JSON.stringify(domain)}>
      {children}
    </div>
  ),
  ZAxis: () => <div data-testid='z-axis'>ZAxis</div>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Scatter: ({ data, name }: { data: any[]; name: string }) => (
    <div data-testid={`scatter-${name.replace(/\s+/g, '-')}`}>Points: {data.length}</div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  ReferenceLine: ({ x, y }: any) => (
    <div data-testid='reference-line' data-x={x} data-y={y}>
      ReferenceLine
    </div>
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

describe('ItemsMap Component', () => {
  const mockData = [
    { x: 0.4, y: 0.6, hover: 1 },
    { x: 0.6, y: 0.8, hover: 2 },
    { x: 0.3, y: -0.2, hover: 3 },
  ]

  const createMockClient = (type = 'multi', alternatives = 4) =>
    ({
      getItemMapData: jest.fn().mockResolvedValue({ data: mockData }),
      getNumberOfAlternatives: jest.fn().mockResolvedValue(alternatives),
      getQuestType: jest.fn().mockReturnValue(type),
    }) as unknown as Client

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: '14px' })
  })

  it('shows loading state initially', () => {
    render(<ItemsMap client={createMockClient()} />)
    expect(screen.getByTestId('spinner')).toHaveTextContent('Loading health data...')
  })

  describe('Multi/Binary Quest Type', () => {
    const mockClient = createMockClient('multi')

    it('sets correct domain and ticks for non-gradu quest', async () => {
      render(<ItemsMap client={mockClient} />)

      await waitFor(() => {
        const xAxis = screen.getByTestId('x-axis')
        const yAxis = screen.getByTestId('y-axis')

        expect(JSON.parse(xAxis.dataset.domain!)).toEqual([0, 1])
        expect(JSON.parse(yAxis.dataset.domain!)).toEqual([-1, 1])
      })
    })

    it('renders reference lines correctly for non-gradu quest', async () => {
      render(<ItemsMap client={mockClient} />)

      await waitFor(() => {
        const referenceLines = screen.getAllByTestId('reference-line')
        expect(referenceLines).toHaveLength(5) // 1 horizontal + 4 vertical
      })
    })
  })

  describe('Gradu Quest Type', () => {
    const alternatives = 5
    const mockClient = createMockClient('gradu', alternatives)

    it('sets correct domain and ticks for gradu quest', async () => {
      render(<ItemsMap client={mockClient} />)

      await waitFor(() => {
        const xAxis = screen.getByTestId('x-axis')
        expect(JSON.parse(xAxis.dataset.domain!)).toEqual([1, alternatives])
      })
    })

    it('calculates correct reference line positions for gradu quest', async () => {
      render(<ItemsMap client={mockClient} />)

      await waitFor(() => {
        const referenceLines = screen.getAllByTestId('reference-line')
        const xValues = referenceLines
          .map(line => line.dataset.x)
          .filter(x => x !== undefined)
          .map(Number)

        // Check that reference lines are positioned correctly
        xValues.forEach(x => {
          expect(x).toBeGreaterThanOrEqual(1)
          expect(x).toBeLessThanOrEqual(alternatives)
        })
      })
    })
  })

  describe('Item Search and Highlight', () => {
    it('handles item search correctly', async () => {
      render(<ItemsMap client={createMockClient()} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByTestId('search-field')
      fireEvent.change(searchInput, { target: { value: '2' } })

      expect(screen.getByTestId('scatter-Highlighted-Item')).toHaveTextContent('Points: 1')
    })

    it('clears highlighted item', async () => {
      render(<ItemsMap client={createMockClient()} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByTestId('search-field')
      fireEvent.change(searchInput, { target: { value: '2' } })

      const clearButton = screen.getByTestId('clear-button')
      fireEvent.click(clearButton)

      expect(screen.getByTestId('scatter-Highlighted-Item')).toHaveTextContent('Points: 0')
    })
  })

  describe('Visual Elements', () => {
    it('renders colored regions', async () => {
      render(<ItemsMap client={createMockClient()} />)

      await waitFor(() => {
        const chart = screen.getByTestId('scatter-chart')
        expect(chart).toContainHTML('fill="green"')
        expect(chart).toContainHTML('fill="yellow"')
        expect(chart).toContainHTML('fill="orange"')
        expect(chart).toContainHTML('fill="red"')
        expect(chart).toContainHTML('fill="black"')
      })
    })

    it('displays region labels', async () => {
      render(<ItemsMap client={createMockClient()} />)

      await waitFor(() => {
        const labels = ['1', '2', '3', '4', '5', 'A', 'B', 'C', 'D', 'E']
        labels.forEach(label => {
          expect(screen.getByText(label)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('handles error in data fetching', async () => {
      const errorClient = {
        ...createMockClient(),
        getItemMapData: jest.fn().mockRejectedValue(new Error('Fetch error')),
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      render(<ItemsMap client={errorClient as unknown as Client} />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })
})
