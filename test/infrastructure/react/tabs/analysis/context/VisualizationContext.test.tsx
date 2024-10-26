import { render, act } from '@testing-library/react'
import { VisualizationProvider } from '../../../../../../src/infrastructure/react/tabs/analysis/context/VisualizationContext'
import type { AnalysisVisualization } from '../../../../../../src/infrastructure/react/tabs/analysis/types'
import { useVisualization } from '../../../../../../src/infrastructure/react/tabs/analysis/context/useVisualization'

// Mock de AnalysisVisualization para las pruebas
const mockVisualization: AnalysisVisualization = {
  label: 'Test Visualization',
  icon: 'test-icon',
  multi: null,
  gradu: null,
  binary: null,
}

// Componente de prueba que usa el hook useVisualization
const TestComponent = () => {
  const { selectedVisualization, setSelectedVisualization } = useVisualization()
  return (
    <div>
      <span data-testid='visualization'>{selectedVisualization?.label}</span>
      <button
        onClick={() => {
          setSelectedVisualization({
            ...mockVisualization,
            label: 'New Visualization',
          })
        }}
      >
        Change Visualization
      </button>
    </div>
  )
}

describe('VisualizationContext', () => {
  it('provides the initial visualization', () => {
    const { getByTestId } = render(
      <VisualizationProvider initialVisualization={mockVisualization}>
        <TestComponent />
      </VisualizationProvider>,
    )

    expect(getByTestId('visualization').textContent).toBe('Test Visualization')
  })

  it('updates the visualization when setSelectedVisualization is called', () => {
    const { getByTestId, getByText } = render(
      <VisualizationProvider initialVisualization={mockVisualization}>
        <TestComponent />
      </VisualizationProvider>,
    )

    act(() => {
      getByText('Change Visualization').click()
    })

    expect(getByTestId('visualization').textContent).toBe('New Visualization')
  })

  it('throws an error when useVisualization is used outside of VisualizationProvider', () => {
    // Silencia los errores de consola para esta prueba
    const consoleSpy = jest.spyOn(console, 'error')
    consoleSpy.mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow('useVisualization must be used within a VisualizationProvider')

    consoleSpy.mockRestore()
  })
})
