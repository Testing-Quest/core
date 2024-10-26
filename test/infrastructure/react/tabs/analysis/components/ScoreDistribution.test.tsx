import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSettings } from '../../../../../../src/infrastructure/react/context/useSettings'
import { ScoreDistribution } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/ScoreDistribution'
import { Client } from '../../../../../../src/infrastructure/Client'

// Mock all external dependencies
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='responsive-container'>{children}</div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  BarChart: ({ children, data, margin }: any) => (
    <div data-testid='bar-chart' data-margin={JSON.stringify(margin)} data-points={data?.length}>
      {children}
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Bar: ({ dataKey, fill }: any) => (
    <div data-testid='bar' data-key={dataKey} data-fill={fill}>
      Bar
    </div>
  ),
  CartesianGrid: () => <div data-testid='cartesian-grid'>Grid</div>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  XAxis: ({ type, dataKey, domain, fontSize }: any) => (
    <div
      data-testid='x-axis'
      data-type={type}
      data-key={dataKey}
      data-domain={JSON.stringify(domain)}
      data-font-size={fontSize}
    >
      XAxis
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  YAxis: ({ type, dataKey }: any) => (
    <div data-testid='y-axis' data-type={type} data-key={dataKey}>
      YAxis
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Tooltip: ({ content, cursor }: any) => (
    <div data-testid='tooltip' data-cursor={JSON.stringify(cursor)}>
      {content}
    </div>
  ),
  Text: () => <div data-testid='text'>Text</div>,
}))

jest.mock('../../../../../../src/infrastructure/react/context/useSettings')
jest.mock('antd', () => ({
  Spin: ({ tip }: { tip: string }) => <div data-testid='spinner'>{tip}</div>,
}))

describe('ScoreDistribution Component', () => {
  const mockData = [
    { x: 0, y: 5 },
    { x: 1, y: 15 },
    { x: 2, y: 30 },
    { x: 3, y: 25 },
    { x: 4, y: 15 },
    { x: 5, y: 10 },
  ]

  const mockClient = {
    getScoreDistribution: jest.fn().mockResolvedValue({ data: mockData }),
  } as unknown as Client

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: '14px' })
  })

  it('shows loading state initially', () => {
    render(<ScoreDistribution client={mockClient} />)
    expect(screen.getByTestId('spinner')).toHaveTextContent('Loading health data...')
  })

  it('fetches and displays data correctly', async () => {
    render(<ScoreDistribution client={mockClient} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      expect(mockClient.getScoreDistribution).toHaveBeenCalled()
      expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-points', mockData.length.toString())
    })
  })

  describe('Chart Configuration', () => {
    it('sets up correct axis configurations', async () => {
      render(<ScoreDistribution client={mockClient} />)

      await waitFor(() => {
        const xAxis = screen.getByTestId('x-axis')
        const yAxis = screen.getByTestId('y-axis')

        // Check X-Axis configuration
        expect(xAxis.dataset.type).toBe('number')
        expect(xAxis.dataset.key).toBe('x')
        expect(xAxis.dataset.domain).toBe('["auto","auto"]')
        expect(xAxis.dataset.fontSize).toBe('14px')

        // Check Y-Axis configuration
        expect(yAxis.dataset.type).toBe('number')
        expect(yAxis.dataset.key).toBe('y')
      })
    })

    it('configures bar properties correctly', async () => {
      render(<ScoreDistribution client={mockClient} />)

      await waitFor(() => {
        const bar = screen.getByTestId('bar')
        expect(bar.dataset.key).toBe('y')
        expect(bar.dataset.fill).toBe('#8884d8')
      })
    })

    it('sets up tooltip configuration correctly', async () => {
      render(<ScoreDistribution client={mockClient} />)

      await waitFor(() => {
        const tooltip = screen.getByTestId('tooltip')
        expect(tooltip.dataset.cursor).toBe('{"fill":"#00000000"}')
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('uses responsive container with correct dimensions', async () => {
      render(<ScoreDistribution client={mockClient} />)

      await waitFor(() => {
        const container = screen.getByTestId('responsive-container')
        expect(container).toBeInTheDocument()
      })
    })

    it('applies margin to chart', async () => {
      render(<ScoreDistribution client={mockClient} />)

      await waitFor(() => {
        const chart = screen.getByTestId('bar-chart')
        const margin = JSON.parse(chart.dataset.margin!)
        expect(margin).toEqual({ bottom: 15 })
      })
    })
  })

  describe('Error Handling', () => {
    it('handles error in data fetching', async () => {
      const errorClient = {
        getScoreDistribution: jest.fn().mockRejectedValue(new Error('Fetch error')),
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      render(<ScoreDistribution client={errorClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Layout and Styling', () => {
    it('applies correct container styles', async () => {
      const { container } = render(<ScoreDistribution client={mockClient} />)

      await waitFor(() => {
        const chartContainer = container.firstChild as HTMLElement
        expect(chartContainer).toHaveStyle({
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '50px',
        })
      })
    })
  })
})
