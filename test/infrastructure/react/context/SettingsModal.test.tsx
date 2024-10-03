import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSettings } from '../../../../src/infrastructure/react/context/SettingContext'
import SettingsModal from '../../../../src/infrastructure/react/context/SettingsModal'
import { act } from 'react'

// Mockear el useSettings
jest.mock('../../../../src/infrastructure/react/context/SettingContext')

describe('SettingsModal', () => {
  const mockUseSettings = useSettings as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal with correct initial values', () => {
    // Given
    mockUseSettings.mockReturnValue({
      fontSize: '16px',
      highContrast: false,
      setFontSize: jest.fn(),
      setHighContrast: jest.fn(),
    })

    // When
    const result = render(<SettingsModal isVisible={true} onClose={jest.fn()} />)

    // Then
    expect(result.getByText('Settings')).toBeInTheDocument()
    expect(result.getByText('Font Size:')).toBeInTheDocument()
    expect(result.getByText('High Contrast:')).toBeInTheDocument()

    // Verifica el valor inicial del Slider
    const slider = result.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', '16')

    // Verifica que el Switch esté en el estado inicial (apagado)
    const highContrastSwitch = result.getByRole('switch')
    expect(highContrastSwitch).not.toBeChecked()
  })

  it('toggles high contrast when switch is clicked', () => {
    // Mockear funciones
    const mockSetHighContrast = jest.fn()

    // Given
    mockUseSettings.mockReturnValue({
      fontSize: '16px',
      highContrast: false,
      setFontSize: jest.fn(),
      setHighContrast: mockSetHighContrast,
    })

    // When
    const result = render(<SettingsModal isVisible={true} onClose={jest.fn()} />)

    // Simula un clic en el Switch de "High Contrast"
    act(() => {
      const highContrastSwitch = result.getByRole('switch')
      fireEvent.click(highContrastSwitch)
    })

    // Then
    expect(mockSetHighContrast).toHaveBeenCalledWith(true, expect.anything())
  })

  it('calls onClose when modal is closed', () => {
    // Mockear la función de cierre
    const mockOnClose = jest.fn()

    // Given
    mockUseSettings.mockReturnValue({
      fontSize: '16px',
      highContrast: false,
      setFontSize: jest.fn(),
      setHighContrast: jest.fn(),
    })

    // When
    const result = render(<SettingsModal isVisible={true} onClose={mockOnClose} />)

    act(() => {
      fireEvent.click(result.getByRole('button', { name: /close/i })) // Encuentra el botón de cierre del modal
    })

    // Then
    expect(mockOnClose).toHaveBeenCalledTimes(1) // Asegura que se ha llamado al cierre
  })
})
