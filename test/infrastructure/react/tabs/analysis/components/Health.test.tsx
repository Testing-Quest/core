import { render, waitFor } from '@testing-library/react'
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
      data: {
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
    const result = render(<Health client={mockClient as any} />)
    console.log(result)

    await waitFor(() => {
      expect(result.getByText('Cronbach Alpha')).toBeInTheDocument()
      expect(result.getByText('0.85')).toBeInTheDocument()
      expect(result.getByText('Reliability')).toBeInTheDocument()
      expect(result.getByText('90%')).toBeInTheDocument()
    })
  })

  it('should handle errors when fetching health data', async () => {
    console.error = jest.fn()

    render(<Health client={mockClient as any} />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching health data:', expect.any(Error))
    })
  })
})
