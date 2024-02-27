import { questGradu } from "../../domain/quests/questGradu";
import { questMulti } from "../../domain/quests/questMulti";
import { QuestData, QuestType } from "../dtos/questDtos";

export function CreateQuest(data: QuestData): questMulti | questGradu {
	if (data.type === QuestType.gradu) {
		return new questGradu(data.matrix, data.keys, data.scale, data.alternatives);
	} else {
		return new questMulti(data.matrix, data.keys, data.scale, data.alternatives);
	}
}
