import { useState } from 'react';
import { Button, Upload, message, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import loadQuest, { QuestData } from '../../../domain/services/loadQuest';

interface UploadedFile {
  name: string;
  response: QuestData | null;
}

const UploadFile = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const response = await loadQuest(file);
      setUploadedFiles((prevFiles) => [...prevFiles, { name: file.name, response }]);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      // TODO: Add custom error handling 
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        onChange={handleChange}
        accept=".xls, .xlsx"
      >
        <div
          style={{
            cursor: "pointer",
            border: '2px dashed #1890ff', // Blue border
            borderRadius: '5px',
            padding: '20px',
            textAlign: 'center',
            width: '400px', // Adjust the width as needed
            marginBottom: '20px',
          }}
        >
          <p>Click or drag file to this area to upload</p>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </div>
      </Upload>

      <List
        dataSource={uploadedFiles}
        renderItem={(item) => (
          <List.Item>
            <Button type="link" onClick={() => console.log(item.response)}>
              {item.name}
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UploadFile;
