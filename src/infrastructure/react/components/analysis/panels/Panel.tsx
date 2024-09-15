import type { questGradu } from '../../../domain/quests/questGradu'
import type { questMulti } from '../../../domain/quests/questMulti'

export type PanelProps = {
  quest: questGradu | questMulti
}
