import { render, renderHook, act, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SettingsProvider } from '../../../../src/infrastructure/react/context/SettingContext'
import { useSettings } from '../../../../src/infrastructure/react/context/useSettings'

describe('SettingsContext', () => {
  describe('SettingsProvider', () => {
    it('renders children within the SettingsProvider', () => {
      const childText = 'Test Content'
      const { getByText } = render(
        <SettingsProvider>
          <div>{childText}</div>
        </SettingsProvider>,
      )
      expect(getByText(childText)).toBeInTheDocument()
    })
  })

  describe('useSettings hook', () => {
    it('provides the initial context values correctly', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      })

      expect(result.current.fontSize).toBe('16px')
      expect(result.current.highContrast).toBe(false)
    })

    it('allows updating fontSize', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      })

      act(() => {
        result.current.setFontSize('18px')
      })

      expect(result.current.fontSize).toBe('18px')
    })

    it('allows updating highContrast', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      })

      act(() => {
        result.current.setHighContrast(true)
      })

      expect(result.current.highContrast).toBe(true)
    })

    it('maintains separate state for fontSize and highContrast', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      })

      act(() => {
        result.current.setFontSize('20px')
        result.current.setHighContrast(true)
      })

      expect(result.current.fontSize).toBe('20px')
      expect(result.current.highContrast).toBe(true)

      act(() => {
        result.current.setFontSize('16px')
      })

      expect(result.current.fontSize).toBe('16px')
      expect(result.current.highContrast).toBe(true)
    })

    it('allows multiple updates to the same setting', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      })

      act(() => {
        result.current.setFontSize('18px')
      })
      expect(result.current.fontSize).toBe('18px')

      act(() => {
        result.current.setFontSize('20px')
      })
      expect(result.current.fontSize).toBe('20px')

      act(() => {
        result.current.setHighContrast(true)
      })
      expect(result.current.highContrast).toBe(true)

      act(() => {
        result.current.setHighContrast(false)
      })
      expect(result.current.highContrast).toBe(false)
    })
  })

  describe('SettingsProvider and useSettings integration', () => {
    it('updates context values across multiple consumers', () => {
      const TestComponent = ({ id }: { id: string }) => {
        const { fontSize, highContrast, setFontSize, setHighContrast } = useSettings()
        return (
          <div data-testid={`component-${id}`}>
            <span data-testid='font-size'>{fontSize}</span>
            <span data-testid='high-contrast'>{highContrast.toString()}</span>
            <button
              onClick={() => {
                setFontSize('22px')
              }}
            >
              Update Font Size
            </button>
            <button
              onClick={() => {
                setHighContrast(true)
              }}
            >
              Update High Contrast
            </button>
          </div>
        )
      }

      const { getByTestId } = render(
        <SettingsProvider>
          <TestComponent id='1' />
          <TestComponent id='2' />
        </SettingsProvider>,
      )

      const component1 = within(getByTestId('component-1'))
      const component2 = within(getByTestId('component-2'))

      expect(component1.getByTestId('font-size').textContent).toBe('16px')
      expect(component1.getByTestId('high-contrast').textContent).toBe('false')
      expect(component2.getByTestId('font-size').textContent).toBe('16px')
      expect(component2.getByTestId('high-contrast').textContent).toBe('false')

      act(() => {
        component1.getByText('Update Font Size').click()
      })

      expect(component1.getByTestId('font-size').textContent).toBe('22px')
      expect(component2.getByTestId('font-size').textContent).toBe('22px')

      act(() => {
        component2.getByText('Update High Contrast').click()
      })

      expect(component1.getByTestId('high-contrast').textContent).toBe('true')
      expect(component2.getByTestId('high-contrast').textContent).toBe('true')
    })
  })
})
