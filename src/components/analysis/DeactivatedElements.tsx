import React from "react";
import { questMulti } from "../../domain/quests/questMulti";
import { questGradu } from "../../domain/quests/questGradu";
import { Card, Button } from "antd";

interface SidebarProps {
  quest: questGradu | questMulti;
  onReset: () => void;
}

export const DeactivatedElements: React.FC<SidebarProps> = ({ quest, onReset }) => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <Card title="Deactivated Items">
          <p>{quest.inactiveItems()}</p>
        </Card>

        <Card title="Deactivated Examinees">
          <p>{quest.inactiveUsers()}</p>
        </Card>

      <div style={{ marginTop: "16px" }}>
        {quest.inactiveUsers().length > 0 || quest.inactiveItems().length > 0 ? (
          <Button type="primary" onClick={onReset}>
            Reset
          </Button>
        ) : null}
      </div>
      </div>
    </div>
  );
};
