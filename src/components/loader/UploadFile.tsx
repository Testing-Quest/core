import { useState } from "react";
import { Button, Upload, message, List, Collapse, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import loadQuest, {
  QuestData,
  QuestType,
} from "../../services/loadQuest";
import { questMulti } from "../../domain/quests/questMulti";
import { questGradu } from "../../domain/quests/questGradu";
import GraficaFiabilidad from "../analysis/plots/reliability";

type Quests = questMulti | questGradu;

interface UploadedFile {
  name: string;
  quest: Quests[];
  scale: number[];
  users: number[];
  items: number[];
}

const UploadFile = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    setLoading(true);
    try {
      const response = await loadQuest(file);
      const quests = (quest: QuestData) => {
        if (quest.type === QuestType.multi) {
          return new questMulti(
            quest.matrix,
            quest.keys,
            quest.scale,
            quest.alternatives,
          );
        } else if (quest.type === QuestType.gradu) {
          return new questGradu(
            quest.matrix,
            quest.keys,
            quest.scale,
            quest.alternatives,
          );
        } else {
          throw new Error("Invalid quest type");
        }
      };

      setUploadedFiles((prevFiles) => [
        {
          name: file.name,
          quest: response.map(quests),
          scale: response.map((quest) => quest.scale),
          users: response.map((quest) => quest.rows),
          items: response.map((quest) => quest.columns),
        },
        ...prevFiles,
      ]);
      onSuccess();
    } catch (error) {
      console.log(error)
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      // TODO: Add custom error handling
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div>
        {showGraph && <GraficaFiabilidad />}
      </div>
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        onChange={handleChange}
        accept=".xls, .xlsx, .ods,"
      >
        <div
          style={{
            cursor: "pointer",
            border: "2px dashed #1890ff", // Blue border
            borderRadius: "5px",
            padding: "20px",
            textAlign: "center",
            width: "400px", // Adjust the width as needed
            marginBottom: "20px",
          }}
        >
          <p>Click or drag file to this area to upload</p>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </div>
      </Upload>

      {loading ? <Spin size="large" /> : null}
      <div style={{ width: "400px" }}>
        <List
          dataSource={uploadedFiles}
          renderItem={(item) => (
            <List.Item key={item.name}>
              <Collapse
                items={[
                  {
                    label: item.name,
                    key: item.name,
                    children: (
                      <List
                        dataSource={item.quest}
                        renderItem={(quest, index) => (
                          <List.Item key={`${item.name}-${index}`}>
                            <Button
                              type="link"
                              onClick={() => {
                                quest.recalculate(); // TODO: Remove this line
                                setShowGraph(true);
                                console.log(quest);
                              }}
                            >
                              {`Scale: ${quest.scaleValue}  (Users: ${item.users[index]}  Items: ${item.items[index]})`}
                            </Button>
                          </List.Item>
                        )}
                      />
                    ),
                  },
                ]}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default UploadFile;
