import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Health from '../../../../../../src/infrastructure/react/tabs/analysis/components/Health'
import { useSettings } from '../../../../../../src/infrastructure/react/context/SettingContext'
import { ClientMock } from '../../../../../__mocks__/clientMock'

jest.mock('../../../../../../src/infrastructure/react/context/SettingContext', () => ({
  useSettings: jest.fn(),
}))

describe('Health Component', () => {
  let mockClient: ClientMock

  beforeEach(() => {
    ;(useSettings as jest.Mock).mockReturnValue({ fontSize: 14 })
    mockClient = ClientMock.createMockClient({
      type: 'multi',
      name: 'Test Quest',
      scale: 1,
    })
  })

  it('should fetch and display health data', async () => {
    const mockHealthData = {
      health: {
        cronbachAlpha: 0.85,
        sem: 2.5,
        mean: 75,
        reliability: 0.9,
        discrimination: 0.7,
        testHealth: 0.8,
      },
      error: null,
    }

    mockClient.setMockHealth(mockHealthData)
    render(<Health client={mockClient as any} />)

    await waitFor(() => {
      expect(screen.getByText('Cronbach Alpha:')).toBeInTheDocument()
      expect(screen.getByText('0.85')).toBeInTheDocument()
      expect(screen.getByText('Reliability:')).toBeInTheDocument()
      expect(screen.getByText('90%')).toBeInTheDocument()
    })
  })

  it('should change decimal places when buttons are clicked', async () => {
    const mockHealthData = {
      health: {
        reliability: 0.87654321,
      },
      error: null,
    }

    mockClient.setMockHealth(mockHealthData)

    render(<Health client={mockClient as any} />)

    await waitFor(() => {
      expect(screen.getByText('87.65%')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'plus' }))

    await waitFor(() => {
      expect(screen.getByText('87.654%')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'minus' }))

    await waitFor(() => {
      expect(screen.getByText('87.65%')).toBeInTheDocument()
    })
  })

  it('should handle errors when fetching health data', async () => {
    console.error = jest.fn() // Mock console.error

    // Don't set mock health data to simulate an error
    render(<Health client={mockClient as any} />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
    })
  })
})
