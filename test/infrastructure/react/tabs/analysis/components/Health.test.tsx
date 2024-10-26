import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Health from '../../../../../../src/infrastructure/react/tabs/analysis/components/Health'
import { useSettings } from '../../../../../../src/infrastructure/react/context/useSettings'
import { QuestMother } from '../../../../../domain/QuestMother'
import { RepositoryMock } from '../../../../../__mocks__/RepositoryMock'
import type { Client } from '../../../../../../src/infrastructure/Client'
import {
  PROPERTY_MAP,
  PIE_CHART_PROPERTY_MAP,
} from '../../../../../../src/infrastructure/react/tabs/analysis/components/Health/constants'
import React from 'react'

// Mock all external dependencies
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => <div>Cell</div>,
  Legend: () => <div>Legend</div>,
  Tooltip: () => <div>Tooltip</div>,
}))

jest.mock('antd', () => ({
  Spin: ({ tip }: { tip: string }) => <div data-testid='spinner'>{tip}</div>,
  Typography: {
    Text: ({ children, type }: { children: React.ReactNode; type?: string }) => (
      <span data-testid={`text-${type || 'default'}`}>{children}</span>
    ),
  },
  Row: ({ children }: { children: React.ReactNode }) => <div data-testid='row'>{children}</div>,
  Col: ({ children }: { children: React.ReactNode }) => <div data-testid='col'>{children}</div>,
  Card: ({ children, title }: { children: React.ReactNode; title?: React.ReactNode }) => (
    <div data-testid='card'>
      {title && <div data-testid='card-title'>{title}</div>}
      {children}
    </div>
  ),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Table: ({ dataSource, columns }: { dataSource: any[]; columns: any[] }) => (
    <table>
      <thead>
        <tr>
          {columns.map((col: any) => (
            <th key={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row: any, i: number) => (
          <tr key={i}>
            {columns.map((col: any) => (
              <td key={col.key}>{col.render ? col.render(row[col.dataIndex]) : row[col.dataIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}))

jest.mock('../../../../../../src/infrastructure/react/context/useSettings')

describe('Health Component', () => {
  const questMother = new QuestMother(new RepositoryMock())
  let mockClient: Client

  beforeEach(() => {
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: '14px' })
  })

  const setupComponent = async (questType: 'multi' | 'binary' | 'gradu') => {
    mockClient = await questMother.getClientForTest('CAL')
    jest.spyOn(mockClient, 'getQuestType').mockReturnValue(questType)

    const healthData = {
      data: {
        cronbachAlpha: 0.91,
        sem: 0.15,
        mean: 75.5,
        variance: 125.4,
        standardDeviation: 11.2,
        reliability: 0.9136,
        discrimination: 0.85,
        testHealth: 0.88,
        ...(questType === 'multi' && {
          keyConflict: 0.05,
          choice: 0.95,
          coherency: 0.92,
          difficulty: 0.75,
        }),
        ...(questType === 'gradu' && {
          score: 82.3,
          variability: 0.78,
        }),
        ...(questType === 'binary' && {
          coherency: 0.94,
          difficulty: 0.72,
        }),
      },
      error: null,
    }

    jest.spyOn(mockClient, 'getHealthData').mockResolvedValue(healthData)
    jest.spyOn(mockClient, 'getFrequencyData').mockResolvedValue({ A: 25, B: 35, C: 40 })
    jest.spyOn(mockClient, 'getModifications').mockResolvedValue({
      response: {
        keys: ['A', 'B', 'C'],
        originalKeys: ['A', 'B', 'C'],
        users: [true, false, true],
        items: [true, false, true],
      },
      error: null,
    })

    return render(<Health client={mockClient} />)
  }

  it('shows loading state initially', async () => {
    const { getByTestId } = await setupComponent('multi')
    expect(getByTestId('spinner')).toHaveTextContent('Loading health data...')
  })

  describe('Multi Quest Type', () => {
    beforeEach(async () => {
      await setupComponent('multi')
    })

    it('displays all multi quest properties', async () => {
      await waitFor(() => {
        Object.values(PROPERTY_MAP.multi).forEach(propertyName => {
          expect(screen.getByText(new RegExp(propertyName))).toBeInTheDocument()
        })
      })
    })

    it('shows attractive and key tables', async () => {
      await waitFor(() => {
        expect(screen.getByText('Attractive')).toBeInTheDocument()
      })
    })
  })

  describe('Gradu Quest Type', () => {
    beforeEach(async () => {
      await setupComponent('gradu')
    })

    it('displays all gradu quest properties', async () => {
      await waitFor(() => {
        Object.values(PROPERTY_MAP.gradu).forEach(propertyName => {
          expect(screen.getByText(new RegExp(propertyName))).toBeInTheDocument()
        })
      })
    })

    it('does not show attractive and key tables', async () => {
      await waitFor(() => {
        expect(screen.queryByText('Attractive')).not.toBeInTheDocument()
        expect(screen.queryByText('Key')).not.toBeInTheDocument()
      })
    })
  })

  describe('Binary Quest Type', () => {
    beforeEach(async () => {
      await setupComponent('binary')
    })

    it('displays all binary quest properties', async () => {
      await waitFor(() => {
        Object.values(PROPERTY_MAP.binary).forEach(propertyName => {
          expect(screen.getByText(new RegExp(propertyName))).toBeInTheDocument()
        })
      })
    })

    it('shows attractive and key tables', async () => {
      await waitFor(() => {
        expect(screen.getByText('Attractive')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('shows error message when health data is not available', async () => {
      mockClient = await questMother.getClientForTest('CAL')
      jest.spyOn(mockClient, 'getHealthData').mockResolvedValue({ data: null, error: 'No health data available' })

      render(<Health client={mockClient} />)

      await waitFor(() => {
        expect(screen.getByText('No health data available')).toBeInTheDocument()
      })
    })

    it('handles API errors gracefully', async () => {
      mockClient = await questMother.getClientForTest('CAL')
      jest.spyOn(mockClient, 'getHealthData').mockRejectedValue(new Error('API Error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      render(<Health client={mockClient} />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Health Chart', () => {
    it('displays pie chart with correct properties', async () => {
      const { getByText } = await setupComponent('multi')

      await waitFor(() => {
        expect(getByText('Health Problems')).toBeInTheDocument()
        Object.values(PIE_CHART_PROPERTY_MAP.multi).forEach(propertyName => {
          expect(screen.getByText(new RegExp(propertyName))).toBeInTheDocument()
        })
      })
    })
  })

  describe('Data Formatting', () => {
    it('formats percentage values correctly', async () => {
      const { getByText } = await setupComponent('multi')

      await waitFor(() => {
        expect(getByText('91.36%')).toBeInTheDocument() // Reliability
        expect(getByText('85%')).toBeInTheDocument() // Discrimination
      })
    })

    it('formats non-percentage values correctly', async () => {
      const { getByText } = await setupComponent('multi')

      await waitFor(() => {
        expect(getByText('0.91')).toBeInTheDocument() // Cronbach Alpha
        expect(getByText('75.5')).toBeInTheDocument() // Mean
      })
    })
  })
})
