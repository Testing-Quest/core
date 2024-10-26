import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SettingsModal from '../../../../src/infrastructure/react/context/SettingsModal'
import { act } from 'react'
import type { SliderSingleProps } from 'antd'
import { useSettings } from '../../../../src/infrastructure/react/context/useSettings'

jest.mock('../../../../src/infrastructure/react/context/useSettings.ts')
jest.mock('antd', () => {
  const antd = jest.requireActual('antd')
  const mockSlider = jest.fn((props: SliderSingleProps) => {
    return (
      <div
        data-testid='mock-slider'
        onClick={() => {
          if (props.onChange && typeof props.onChange === 'function') {
            props.onChange(20)
          }
        }}
      >
        {props.value}
      </div>
    )
  })
  return { ...antd, Slider: mockSlider }
})

describe('SettingsModal', () => {
  const mockUseSettings = useSettings as jest.Mock
  const mockSetFontSize = jest.fn()
  const mockSetHighContrast = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSettings.mockReturnValue({
      fontSize: '16px',
      highContrast: false,
      setFontSize: mockSetFontSize,
      setHighContrast: mockSetHighContrast,
    })
  })

  it('renders modal with correct initial values', () => {
    render(<SettingsModal isVisible={true} onClose={mockOnClose} />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Font Size:')).toBeInTheDocument()
    expect(screen.getByText('High Contrast:')).toBeInTheDocument()
    const slider = screen.getByTestId('mock-slider')
    expect(slider).toHaveTextContent('16')
    const highContrastSwitch = screen.getByRole('switch')
    expect(highContrastSwitch).not.toBeChecked()
  })

  it('toggles high contrast when switch is clicked', () => {
    render(<SettingsModal isVisible={true} onClose={mockOnClose} />)
    const highContrastSwitch = screen.getByRole('switch')
    act(() => {
      fireEvent.click(highContrastSwitch)
    })
    expect(mockSetHighContrast).toHaveBeenCalledWith(true, expect.anything())
  })

  it('updates font size when slider is moved', () => {
    render(<SettingsModal isVisible={true} onClose={mockOnClose} />)
    const slider = screen.getByTestId('mock-slider')
    act(() => {
      fireEvent.click(slider)
    })
    expect(mockSetFontSize).toHaveBeenCalledWith('20px')
  })

  it('calls onClose when modal is closed', () => {
    render(<SettingsModal isVisible={true} onClose={mockOnClose} />)
    const closeButton = screen.getByRole('button', { name: /close/i })
    act(() => {
      fireEvent.click(closeButton)
    })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not render modal when isVisible is false', () => {
    render(<SettingsModal isVisible={false} onClose={mockOnClose} />)
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })
})
