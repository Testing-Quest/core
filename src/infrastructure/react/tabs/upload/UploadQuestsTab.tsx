import React from 'react'
import { List, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import type { AnalysisQuest } from '../../types/AnalysisQuest'
import type { UploadQuest } from './UploadQuest'
import { v4 as uuidv4 } from 'uuid'
import { Client } from '../../../Client'
import UploadItem from './UploadItem'
import type { UploadChangeParam } from 'antd/es/upload'

type UploadQuestsTabProps = {
  addAnalysisQuest(quest: AnalysisQuest): void
}

const UploadQuestsTab: React.FC<UploadQuestsTabProps> = ({ addAnalysisQuest }) => {
  const [uploadedQuests, setUploadedQuests] = React.useState<UploadQuest[]>([])

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const workbook = XLSX.read(await file.arrayBuffer())
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      const quests = await Client.createQuest({ data })
      if (quests.error) {
        message.error(quests.error)
        onError(quests.error)
        return
      }
      const newQuest: UploadQuest = {
        uuid: uuidv4(),
        name: file.name,
        quests: quests.childs!,
      }
      setUploadedQuests([...uploadedQuests, newQuest])
      onSuccess()
    } catch (err) {
      onError(err)
    }
  }
  const handleChange = (info: UploadChangeParam) => {
    const { file } = info
    if (file.status === 'done') {
      message.success(`${file.name} file uploaded successfully`)
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`)
    }
  }

  return (
    <div className='p-4'>
      <Upload.Dragger
        name='file'
        customRequest={customRequest}
        showUploadList={false}
        onChange={handleChange}
        className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6'
        data-testid='file-input'
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined className='text-4xl text-blue-500' />
        </p>
        <p className='ant-upload-text text-lg font-medium mt-4'>Click or drag file to this area to upload</p>
        <p className='ant-upload-hint text-sm text-gray-500 mt-2'>Support for single or bulk upload.</p>
      </Upload.Dragger>
      <List
        dataSource={uploadedQuests}
        renderItem={item => (
          <UploadItem item={item} onDelete={() => {}} onAddAnalysis={addAnalysisQuest} showDeleteButton={true} />
        )}
      />
    </div>
  )
}

export default UploadQuestsTab
