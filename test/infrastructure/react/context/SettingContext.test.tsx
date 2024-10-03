import { render, renderHook } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SettingsProvider, useSettings } from '../../../../src/infrastructure/react/context/SettingContext'
import { act } from 'react'

describe('SettingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children within the SettingsProvider', async () => {
    const childText = 'Contenido de prueba'

    const result = render(
      <SettingsProvider>
        <div>{childText}</div>
      </SettingsProvider>,
    )

    expect(result.getByText(childText)).toBeInTheDocument()
  })

  it('provides the initial context values correctly', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    expect(result.current.fontSize).toBe('16px')
    expect(result.current.highContrast).toBe(false)
  })

  it('allows updating fontSize via set functions', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    act(() => {
      result.current.setFontSize('18px')
    })

    expect(result.current.fontSize).toBe('18px')
  })
  it('allows updating highContrast via set functions', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })
    act(() => {
      result.current.setHighContrast(true)
    })

    expect(result.current.highContrast).toBe(true)
  })
})
