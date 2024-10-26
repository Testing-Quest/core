import { render, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { message } from 'antd'
import * as XLSX from 'xlsx'
import UploadQuestsTab from '../../../../../src/infrastructure/react/tabs/upload/UploadQuestsTab'
import { Client } from '../../../../../src/infrastructure/Client'

jest.mock('../../../../../src/infrastructure/Client')
jest.mock('xlsx')
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }))
jest.mock('../../../../../src/infrastructure/react/context/useSettings.ts', () => ({
  useSettings: jest.fn(() => ({
    fontSize: '16px',
    highContrast: false,
    setFontSize: jest.fn(),
    setHighContrast: jest.fn(),
  })),
}))

describe('UploadQuestsTab', () => {
  const mockAddAnalysisQuest = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the upload area', () => {
    const result = render(<UploadQuestsTab addAnalysisQuest={mockAddAnalysisQuest} />)
    expect(result.getByText('Click or drag file to this area to upload')).toBeInTheDocument()
  })

  it('uploads a file successfully', async () => {
    const mockFile = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))
    ;(XLSX.read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    })
    ;(XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([['header'], ['data']])
    ;(Client.createQuest as jest.Mock).mockResolvedValue({
      childs: [{ uuid: 'quest-uuid', scale: 5, type: 'multi' }],
    })

    const result = render(<UploadQuestsTab addAnalysisQuest={mockAddAnalysisQuest} />)

    const input = result.getByTestId('file-input')
    await userEvent.upload(input, mockFile)

    await waitFor(() => {
      expect(result.getByText('test.xlsx')).toBeInTheDocument()
    })

    expect(message.success).toHaveBeenCalledWith('test.xlsx file uploaded successfully')
  })

  it('shows an error message when file upload fails', async () => {
    const mockFile = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    mockFile.arrayBuffer = jest.fn().mockRejectedValue(new Error('Upload failed'))

    const result = render(<UploadQuestsTab addAnalysisQuest={mockAddAnalysisQuest} />)

    const input = result.getByTestId('file-input')
    await userEvent.upload(input, mockFile)

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('test.xlsx file upload failed.')
    })
  })

  it('deletes an uploaded quest', async () => {
    const mockFile = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))
    ;(Client.createQuest as jest.Mock).mockResolvedValue({
      childs: [{ uuid: 'quest-uuid', scale: 5, type: 'multi' }],
    })

    const result = render(<UploadQuestsTab addAnalysisQuest={mockAddAnalysisQuest} />)

    const input = result.getByTestId('file-input')
    await userEvent.upload(input, mockFile)

    await waitFor(() => {
      expect(result.getByText('test.xlsx')).toBeInTheDocument()
    })

    const deleteButton = result.getByLabelText('delete')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(result.queryByText('test.xlsx')).not.toBeInTheDocument()
    })
  })
})
