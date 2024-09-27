/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { App } from '../../../src/infrastructure/react/App'

describe('App Component', () => {
  // Test 1: Verificar que el componente renderiza las tabs iniciales
  test('should render Upload and Examples tabs', async () => {
    // Given: El componente ha sido montado
    await act(async () => {
      render(<App />)
    })

    // Then: Se deben renderizar las pestañas Upload y Examples
    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByText('Examples')).toBeInTheDocument()
  })

  // Test 2: Verificar que se puede agregar una nueva pestaña dinámica
  test('should add a new analysis tab when a quest is added', async () => {
    // Given: El componente ha sido montado
    await act(async () => {
      render(<App />)
    })

    // When: Se añade una nueva "AnalysisQuest"
    await act(async () => {
      const addAnalysisQuestButton = screen.getByText('Examples') // Simular que se llama a addAnalysisQuest en la pestaña de Examples
      fireEvent.click(addAnalysisQuestButton) // Simular click
    })

    // Then: Se debe añadir una nueva pestaña dinámica
    expect(screen.getByText('Quest 1 - scale: 5')).toBeInTheDocument()
  })

  // Test 3: Verificar que al hacer click en una pestaña existente no se crea una nueva
  test('should not add a new tab if the quest already exists', async () => {
    // Given: El componente ha sido montado con una pestaña dinámica ya existente
    await act(async () => {
      render(<App />)
    })

    // Se añade una primera vez
    await act(async () => {
      const addAnalysisQuestButton = screen.getByText('Examples')
      fireEvent.click(addAnalysisQuestButton)
    })

    // When: Se vuelve a hacer click para agregar el mismo quest
    await act(async () => {
      const addAnalysisQuestButton = screen.getByText('Examples')
      fireEvent.click(addAnalysisQuestButton)
    })

    // Then: Debe haber solo una pestaña para ese "quest", no duplicada
    const questTabs = screen.getAllByText(/Quest 1 - scale: 5/)
    expect(questTabs).toHaveLength(1)
  })

  // Test 4: Verificar que se puede eliminar una pestaña dinámica
  test('should remove a tab when the close button is clicked', async () => {
    // Given: El componente ha sido montado con una pestaña dinámica ya existente
    await act(async () => {
      render(<App />)
    })

    // Añadir una pestaña dinámica
    await act(async () => {
      const addAnalysisQuestButton = screen.getByText('Examples')
      fireEvent.click(addAnalysisQuestButton)
    })

    // When: El botón de cerrar en la pestaña dinámica es clicado
    await act(async () => {
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
    })

    // Then: La pestaña debe desaparecer
    expect(screen.queryByText('Quest 1 - scale: 5')).not.toBeInTheDocument()
  })

  // Test 5: Verificar que al hacer click en una pestaña, se activa
  test('should activate the clicked tab', async () => {
    // Given: El componente ha sido montado
    await act(async () => {
      render(<App />)
    })

    // When: Se hace click en la pestaña de "Upload"
    await act(async () => {
      const uploadTab = screen.getByText('Upload')
      fireEvent.click(uploadTab)
    })

    // Then: La pestaña de "Upload" debe estar activa
    const uploadTab = screen.getByText('Upload')
    expect(uploadTab.closest('div')).toHaveClass('ant-tabs-tab-active')
  })
})
