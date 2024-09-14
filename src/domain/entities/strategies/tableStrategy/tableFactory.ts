import { QuestTypes } from "../../../primitives";
import { TableStrategy, TableStrategyBinary, TableStrategyGradu, TableStrategyMulti } from "./TableStrategy";


export function tableFactory<Q extends QuestTypes>(type: Q["type"]): TableStrategy<Q> {
  switch (type) {
    case 'gradu':
      return new TableStrategyGradu() as TableStrategy<Q>;
    case 'multi':
      return new TableStrategyMulti() as TableStrategy<Q>;
    case 'binary':
      return new TableStrategyBinary() as TableStrategy<Q>;
    default:
      throw new Error('Invalid calc type');
  }
}
