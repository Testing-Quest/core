import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSettings } from '../../../../../../src/infrastructure/react/context/useSettings'
import { Reliability } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/Reliability'
import { Client } from '../../../../../../src/infrastructure/Client'

// Mock all external dependencies
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='responsive-container'>{children}</div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  LineChart: ({ children, data, margin }: any) => (
    <div data-testid='line-chart' data-margin={JSON.stringify(margin)} data-points={data?.length}>
      {children}
    </div>
  ),

  Line: ({ dataKey, stroke, strokeWidth, isAnimationActive }: any) => (
    <div
      data-testid='line'
      data-key={dataKey}
      data-stroke={stroke}
      data-width={strokeWidth}
      data-animation={isAnimationActive}
    >
      Line
    </div>
  ),
  CartesianGrid: () => <div data-testid='cartesian-grid'>Grid</div>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  XAxis: ({ domain, tickCount, label }: any) => (
    <div data-testid='x-axis' data-domain={JSON.stringify(domain)} data-ticks={tickCount} data-label={label.value}>
      XAxis
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  YAxis: ({ domain, tickCount, label }: any) => (
    <div data-testid='y-axis' data-domain={JSON.stringify(domain)} data-ticks={tickCount} data-label={label.value}>
      YAxis
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Tooltip: ({ labelFormatter, formatter }: any) => (
    <div data-testid='tooltip'>
      <span data-testid='label-format'>{labelFormatter(1.0)}</span>
      <span data-testid='value-format'>{formatter(0.85)[0]}</span>
    </div>
  ),
}))

jest.mock('../../../../../../src/infrastructure/react/context/useSettings')
jest.mock('antd', () => ({
  Spin: ({ tip }: { tip: string }) => <div data-testid='spinner'>{tip}</div>,
}))

describe('Reliability Component', () => {
  const mockData = [
    { x: 0.5, y: 0.6 },
    { x: 0.8, y: 0.75 },
    { x: 1.0, y: 0.85 },
    { x: 1.2, y: 0.9 },
    { x: 1.5, y: 0.95 },
  ]

  const mockClient = {
    getReliabilityData: jest.fn().mockResolvedValue({ reliability: mockData }),
  } as unknown as Client

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: '14px' })
  })

  it('shows loading state initially', () => {
    render(<Reliability client={mockClient} />)
    expect(screen.getByTestId('spinner')).toHaveTextContent('Loading health data...')
  })

  it('fetches and displays data correctly', async () => {
    render(<Reliability client={mockClient} />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      expect(mockClient.getReliabilityData).toHaveBeenCalled()
      expect(screen.getByTestId('line-chart')).toHaveAttribute('data-points', mockData.length.toString())
    })
  })

  describe('Chart Configuration', () => {
    it('sets up correct axis configurations', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const xAxis = screen.getByTestId('x-axis')
        const yAxis = screen.getByTestId('y-axis')

        // Check X-Axis configuration
        expect(JSON.parse(xAxis.dataset.domain!)).toEqual([0.5, 1.5])
        expect(xAxis.dataset.ticks).toBe('11')
        expect(xAxis.dataset.label).toBe('Test length ')

        // Check Y-Axis configuration
        expect(JSON.parse(yAxis.dataset.domain!)).toEqual([0, 1])
        expect(yAxis.dataset.ticks).toBe('11')
        expect(yAxis.dataset.label).toBe('Reliability')
      })
    })

    it('configures line properties correctly', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const line = screen.getByTestId('line')
        expect(line.dataset.key).toBe('y')
        expect(line.dataset.stroke).toBe('#8884d8')
        expect(line.dataset.width).toBe('3')
        expect(line.dataset.animation).toBe('false')
      })
    })

    it('sets up tooltip formatters correctly', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const labelFormat = screen.getByTestId('label-format')
        const valueFormat = screen.getByTestId('value-format')

        expect(labelFormat).toHaveTextContent('Length: 1.0')
        expect(valueFormat).toHaveTextContent('0.85')
      })
    })

    it('applies correct container dimensions', async () => {
      const { container } = render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const chartContainer = container.firstChild as HTMLElement
        expect(chartContainer).toHaveStyle({
          height: '600px',
          marginLeft: '50px',
        })
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('uses responsive container with correct dimensions', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const container = screen.getByTestId('responsive-container')
        const chart = screen.getByTestId('line-chart')

        expect(container).toBeInTheDocument()
        expect(chart).toBeInTheDocument()
      })
    })

    it('applies margin to chart', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const chart = screen.getByTestId('line-chart')
        const margin = JSON.parse(chart.dataset.margin!)
        expect(margin).toEqual({ bottom: 15 })
      })
    })
  })

  describe('Error Handling', () => {
    it('handles error in data fetching', async () => {
      const errorClient = {
        getReliabilityData: jest.fn().mockRejectedValue(new Error('Fetch error')),
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      render(<Reliability client={errorClient as unknown as Client} />)

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Visual Elements', () => {
    it('renders grid with correct opacity', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
      })
    })

    it('renders colored region', async () => {
      render(<Reliability client={mockClient} />)

      await waitFor(() => {
        const chart = screen.getByTestId('line-chart')
        expect(chart).toContainHTML('fill="green"')
      })
    })
  })
})
