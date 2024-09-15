import { questGradu } from '../../../domain/quests/questGradu'
import { questMulti } from '../../../domain/quests/questMulti'

export interface PanelProps {
  quest: questGradu | questMulti
}
