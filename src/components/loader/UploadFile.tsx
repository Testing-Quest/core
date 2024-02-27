import { useState } from "react";
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, List, Collapse, Spin } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import loadQuest from "../../application/services/loadQuest";
import { UploadedQuest, useGlobalState } from "../GlobalState";
import { useNavigate } from "react-router-dom";
import { CreateQuest } from "../../application/services/createQuest";

const UploadFile = () => {
  const {
    uploadedQuests,
    addAnalysisQuest,
    addUploadedQuest,
    removeUploadedQuest,
    removeAnalysisQuest
  } = useGlobalState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRemoveQuest = (item: UploadedQuest) => {
    removeUploadedQuest(item.id);
    removeAnalysisQuest(item.id);
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    setLoading(true);
    try {
      const uploadedQuest = {
        id: "uploadedQuest" + Math.floor(Math.random() * 1000000),
        name: file.name,
        quests: await loadQuest(file),
      };
      addUploadedQuest(uploadedQuest);
      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
  };

  const renderUploadedQuest = (item: UploadedQuest) => (
    <List.Item key={item.name}>
      <Collapse
        style={{ width: '100%' }}
        items={[
          {
            label: item.name,
            key: item.name,
            extra: <CloseOutlined onClick={() => handleRemoveQuest(item)} />,
            children: (
              <List
                dataSource={item.quests}
                renderItem={(quest, index) => (
                  <List.Item key={`${item.name}-${index}`}>
                    <Button
                      type="link"
                      onClick={() => {
                        addAnalysisQuest({
                          id: item.id + "-" + quest.scale,
                          name: item.name + " - " + quest.scale,
                          quest: CreateQuest(quest),
                        });
                        navigate(`/analysis`);
                      }}
                    >
                      {`Scale: ${quest.scale}  [Users: ${quest.rows}  Items: ${quest.columns}]`}
                    </Button>
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </List.Item>
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        onChange={handleChange}
        accept=".xls, .xlsx, .ods,"
      >
        <div
          style={{
            cursor: "pointer",
            border: "2px dashed #1890ff",
            borderRadius: "5px",
            padding: "20px",
            textAlign: "center",
            width: "400px",
            marginBottom: "20px",
          }}
        >
          <p>Click or drag file to this area to upload</p>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </div>
      </Upload>

      {loading ? <Spin size="large" /> : null}
      <div style={{ width: "400px" }}>
        <List dataSource={uploadedQuests} renderItem={renderUploadedQuest} />
      </div>
    </div>
  );
};

export default UploadFile;
